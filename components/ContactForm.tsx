"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/actions";
import { validateContact, type ContactPayload } from "@/lib/email/contact";

type ContactFormProps = {
  /** The live /hafa-samband form has a phone field; the home page one doesn't. */
  showPhone?: boolean;
  submitLabel: string;
};

const SUCCESS_TEXT =
  "Takk fyrir! Við höfum móttekið fyrirspurnina og svörum innan 1 klst á opnunartíma.";

const fieldClass =
  "w-full rounded-md border border-transparent bg-[#f0f4fa] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-dark focus:outline-none";

export function ContactForm({ showPhone = false, submitLabel }: ContactFormProps) {
  const [nafn, setNafn] = useState("");
  const [netfang, setNetfang] = useState("");
  const [simi, setSimi] = useState("");
  const [skilabod, setSkilabod] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ContactPayload = { nafn, netfang, simi, skilabod, website };
    const clientError = validateContact(payload);
    if (clientError) {
      setError(clientError);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitContact(payload);
      if (result.ok) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return <p className="text-sm font-medium text-neutral-900">{SUCCESS_TEXT}</p>;
  }

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(e.target.value);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/*
        The live /hafa-samband form (the wide, showPhone variant) puts Nafn
        and Netfang side by side on a two-column row (docs/reference/
        hafa-samband.desktop.jpg); the narrow home mini-form stacks every
        field in one column (docs/reference/home.desktop.jpg). showPhone
        already distinguishes those two call sites, so it doubles as the
        layout signal here rather than adding another prop.
      */}
      <div className={showPhone ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
        <div>
          <label htmlFor="contact-nafn" className="sr-only">
            Nafn
          </label>
          <input
            id="contact-nafn"
            name="name"
            type="text"
            placeholder="Nafn"
            autoComplete="name"
            value={nafn}
            onChange={onChange(setNafn)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="contact-netfang" className="sr-only">
            Netfang
          </label>
          <input
            id="contact-netfang"
            name="email"
            type="email"
            placeholder="Netfang"
            autoComplete="email"
            value={netfang}
            onChange={onChange(setNetfang)}
            className={fieldClass}
          />
        </div>
      </div>
      {showPhone ? (
        <div>
          <label htmlFor="contact-simi" className="sr-only">
            Símanúmer
          </label>
          <input
            id="contact-simi"
            name="phoneNumber"
            type="tel"
            placeholder="Símanúmer"
            autoComplete="tel"
            value={simi}
            onChange={onChange(setSimi)}
            className={fieldClass}
          />
        </div>
      ) : null}
      <div>
        <label htmlFor="contact-skilabod" className="sr-only">
          Skilaboð
        </label>
        <textarea
          id="contact-skilabod"
          name="message"
          placeholder="Skilaboð"
          rows={5}
          value={skilabod}
          onChange={onChange(setSkilabod)}
          className={fieldClass}
        />
      </div>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Vefsíða (ekki fylla út)</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={website}
          onChange={onChange(setWebsite)}
        />
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sendi..." : submitLabel}
      </button>
    </form>
  );
}
