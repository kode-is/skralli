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
  /**
   * "default" (the only variant that existed before) renders exactly as
   * before — verified byte-for-byte against the live home page and
   * /hafa-samband, so its branch below must never change. "card" is the
   * product-redesign's inquiry-card styling (design.dc.html 1a/1d): visible
   * labels, filled/focus-ring inputs, a square full-width submit button,
   * and an inline error under the invalid field instead of a bottom-only
   * message.
   */
  variant?: "default" | "card";
  /**
   * Field background. "tinted" (#f0f4fa) is for forms sitting on white, like
   * /hafa-samband; "white" is for forms inside a tinted card, like the home
   * page's "Hafa samband" card and the product quote card. A tinted field on
   * a tinted card is invisible, which is the bug this prop fixes.
   */
  fieldTone?: "tinted" | "white";
};

const SUCCESS_TEXT =
  "Takk fyrir! Við höfum móttekið fyrirspurnina og svörum innan 1 klst á opnunartíma.";

// Measured on skralli.is: fields are 62 px tall (20 px padding around a 22 px
// line of 16 px Figtree), 10 px radius, no border, 15 px apart.
const FIELD_BASE =
  "block w-full rounded-[10px] border border-transparent px-5 py-[19px] text-base leading-[22px] text-black placeholder:text-[#8a8f98] focus:border-brand-dark focus:outline-none";
const TONE_CLASS = { tinted: "bg-[#f0f4fa]", white: "bg-white" } as const;

// Map validation error messages to field names for aria-invalid/aria-describedby
const ERROR_MESSAGE_TO_FIELD: Record<string, "nafn" | "netfang" | "skilabod"> = {
  "Vinsamlegast fylltu út nafn.": "nafn",
  "Vinsamlegast sláðu inn gilt netfang.": "netfang",
  "Vinsamlegast skrifaðu skilaboð.": "skilabod",
};

const CARD_LABEL_CLASS = "mb-1.5 block font-ui text-xs font-semibold text-[#171717]";

const CARD_FIELD_BASE =
  "block w-full rounded-[10px] border font-ui text-base text-[#171717] placeholder:text-[#8a8f98] outline-none focus:border-brand-mid focus:ring-[3px] focus:ring-brand-mid/[.18]";

function cardFieldClass(hasError: boolean, tone: "tinted" | "white", extra: string) {
  const state = hasError ? "border-[#C0392B] bg-[#FFF7F7]" : `border-transparent ${TONE_CLASS[tone]}`;
  return `${CARD_FIELD_BASE} ${extra} ${state}`;
}

export function ContactForm({
  showPhone = false,
  submitLabel,
  defaultMessage,
  variant = "default",
  fieldTone = "tinted",
}: ContactFormProps) {
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

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(e.target.value);

  const errorField = error ? ERROR_MESSAGE_TO_FIELD[error] : null;

  if (success) {
    if (variant === "card") {
      return (
        <div role="status" aria-live="polite">
          <div
            aria-hidden="true"
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6F0] font-ui text-lg font-bold text-accent-green"
          >
            ✓
          </div>
          <h3 className="font-sans text-[22px] font-semibold text-[#171717]">Fyrirspurn móttekin</h3>
          <p className="mt-2 font-ui text-[13px] leading-[1.55] text-[#444444]">{SUCCESS_TEXT}</p>
        </div>
      );
    }
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm font-medium text-neutral-900">{SUCCESS_TEXT}</p>
      </div>
    );
  }

  if (variant === "card") {
    // The bottom live region stays mounted at all times (so screen readers
    // keep hearing updates the same way the default variant's does) but is
    // visually hidden whenever the current error is field-specific, because
    // that message is duplicated — visibly, decoratively — right under the
    // offending field instead.
    const hasFieldError = Boolean(errorField);

    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="contact-nafn" className={CARD_LABEL_CLASS}>
              Nafn
            </label>
            <input
              id="contact-nafn"
              name="name"
              type="text"
              autoComplete="name"
              value={nafn}
              onChange={onChange(setNafn)}
              className={cardFieldClass(errorField === "nafn", fieldTone, "h-[54px] px-5")}
              aria-invalid={errorField === "nafn"}
              aria-describedby={errorField === "nafn" ? "contact-error-message" : undefined}
            />
            {errorField === "nafn" ? (
              <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
                {error}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="contact-netfang" className={CARD_LABEL_CLASS}>
              Netfang
            </label>
            <input
              id="contact-netfang"
              name="email"
              type="email"
              autoComplete="email"
              value={netfang}
              onChange={onChange(setNetfang)}
              className={cardFieldClass(errorField === "netfang", fieldTone, "h-[54px] px-5")}
              aria-invalid={errorField === "netfang"}
              aria-describedby={errorField === "netfang" ? "contact-error-message" : undefined}
            />
            {errorField === "netfang" ? (
              <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
                {error}
              </p>
            ) : null}
          </div>
        </div>
        {showPhone ? (
          <div>
            <label htmlFor="contact-simi" className={CARD_LABEL_CLASS}>
              Símanúmer
            </label>
            <input
              id="contact-simi"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              value={simi}
              onChange={onChange(setSimi)}
              className={cardFieldClass(false, fieldTone, "h-[54px] px-5")}
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="contact-skilabod" className={CARD_LABEL_CLASS}>
            Skilaboð
          </label>
          <textarea
            id="contact-skilabod"
            name="message"
            rows={4}
            value={skilabod}
            onChange={onChange(setSkilabod)}
            className={cardFieldClass(errorField === "skilabod", fieldTone, "h-[108px] resize-none px-5 py-4")}
            aria-invalid={errorField === "skilabod"}
            aria-describedby={errorField === "skilabod" ? "contact-error-message" : undefined}
          />
          {errorField === "skilabod" ? (
            <p aria-hidden="true" className="mt-1.5 font-ui text-xs font-medium text-[#C0392B]">
              {error}
            </p>
          ) : null}
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
        <div role="status" aria-live="polite" className={hasFieldError ? "sr-only" : undefined}>
          {error ? (
            <p id="contact-error-message" className="font-ui text-xs font-medium text-[#C0392B]">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="h-[62px] w-full rounded-[10px] bg-brand-dark px-[30px] text-base font-semibold text-white transition-colors duration-200 hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Sendi..." : submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[15px]">
      {/*
        The live /hafa-samband form (the wide, showPhone variant) puts Nafn
        and Netfang side by side on a two-column row (docs/reference/
        hafa-samband.desktop.jpg); the narrow home mini-form stacks every
        field in one column (docs/reference/home.desktop.jpg). showPhone
        already distinguishes those two call sites, so it doubles as the
        layout signal here rather than adding another prop.
      */}
      <div className={showPhone ? "grid gap-[15px] sm:grid-cols-2 sm:gap-3.5" : "flex flex-col gap-[15px]"}>
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
            className={`${FIELD_BASE} ${TONE_CLASS[fieldTone]}`}
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
            className={`${FIELD_BASE} ${TONE_CLASS[fieldTone]}`}
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
            className={`${FIELD_BASE} ${TONE_CLASS[fieldTone]}`}
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
          style={{ height: showPhone ? 118 : 143 }}
          value={skilabod}
          onChange={onChange(setSkilabod)}
          className={`${FIELD_BASE} ${TONE_CLASS[fieldTone]}`}
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
      {/* Always mounted so screen readers hear updates; takes no room when empty. */}
      <div role="status" aria-live="polite" className={error ? undefined : "-mt-[15px]"}>
        {error ? <p id="contact-error-message" className="text-sm font-medium text-red-600">{error}</p> : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-[62px] w-full rounded-[10px] bg-brand-dark px-6 text-base font-semibold text-white transition-colors duration-200 hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Sendi..." : submitLabel}
      </button>
    </form>
  );
}
