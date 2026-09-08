import { ContactForm } from "@/components/ContactForm";

// Mockup 1 (design/Main.tpl.html)'s inquiry card, reused as-is on every
// product page: heading + one line of copy + the shared ContactForm with
// the product name prefilled into the message field.
export function InquiryCard({ productTitle }: { productTitle: string }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-[#e0e0e0] bg-white p-7 shadow-sm">
      <h3 className="text-xl font-bold text-neutral-900">Fá tilboð í {productTitle}</h3>
      <p className="text-sm leading-relaxed text-neutral-600">
        Við bjóðum fast verð í verkið. Vörunafnið fylgir fyrirspurninni sjálfkrafa.
      </p>
      <ContactForm
        showPhone
        submitLabel="Senda!"
        defaultMessage={`Fyrirspurn um ${productTitle}`}
      />
    </div>
  );
}
