"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { submitContact } from "@/app/actions";
import { validateContact, type ContactPayload } from "@/lib/email/contact";

type ContactFormProps = {
  /** The live /hafa-samband form has a phone field; the home page one doesn't. */
  showPhone?: boolean;
  submitLabel: string;
  /**
   * Prefills the message field (e.g. a product inquiry card's "Fyrirspurn um
   * <product>" default) — the visitor can still edit or clear it like any
   * other field, it's just the textarea's initial value.
   */
  defaultMessage?: string;
};

const SUCCESS_TEXT =
  "Takk fyrir! Við höfum móttekið fyrirspurnina og svörum innan 1 klst á opnunartíma.";

const fieldClass =
  "w-full rounded-md border border-transparent bg-[#f0f4fa] px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-dark focus:outline-none";

// Map validation error messages to field names for aria-invalid/aria-describedby
const ERROR_MESSAGE_TO_FIELD: Record<string, "nafn" | "netfang" | "skilabod"> = {
  "Vinsamlegast fylltu út nafn.": "nafn",
  "Vinsamlegast sláðu inn gilt netfang.": "netfang",
  "Vinsamlegast skrifaðu skilaboð.": "skilabod",
};

export function ContactForm({ showPhone = false, submitLabel, defaultMessage }: ContactFormProps) {
  const [nafn, setNafn] = useState("");
  const [netfang, setNetfang] = useState("");
  const [simi, setSimi] = useState("");
  const [skilabod, setSkilabod] = useState(defaultMessage ?? "");
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
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm font-medium text-neutral-900">{SUCCESS_TEXT}</p>
      </div>
    );
  }

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(e.target.value);

  const errorField = error ? ERROR_MESSAGE_TO_FIELD[error] : null;

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
            aria-invalid={errorField === "nafn"}
            aria-describedby={errorField === "nafn" ? "contact-error-message" : undefined}
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
            aria-invalid={errorField === "netfang"}
            aria-describedby={errorField === "netfang" ? "contact-error-message" : undefined}
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
          aria-invalid={errorField === "skilabod"}
          aria-describedby={errorField === "skilabod" ? "contact-error-message" : undefined}
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
      <div role="status" aria-live="polite" className="min-h-[1.5rem]">
        {error ? <p id="contact-error-message" className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>
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
