import Link from "next/link";

type StepCardProps = {
  number: string;
  title: string;
  text: string;
  /** Verbatim scrape link text, arrow included (e.g. "Senda fyrirspurn →"). */
  linkText: string;
  href: string;
};

export function StepCard({ number, title, text, linkText, href }: StepCardProps) {
  // `linkText` is the verbatim scrape string with its arrow included (e.g.
  // "Senda fyrirspurn →") — split the arrow into its own span so it alone
  // can slide on hover, without changing the link's visible text.
  const arrowMatch = linkText.match(/^(.*\S)\s+(→)$/);
  const label = arrowMatch ? arrowMatch[1] : linkText;
  const arrow = arrowMatch ? arrowMatch[2] : null;

  return (
    <div className="flex flex-col rounded-2xl bg-[#f0f4fa] p-6 md:p-8">
      <div className="flex items-start gap-3">
        <h3 className="text-2xl font-semibold text-brand-dark">{number}</h3>
        <h5 className="font-ui text-lg font-semibold text-neutral-900">{title}</h5>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{text}</p>
      <Link
        href={href}
        className="group/link mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-dark transition hover:underline"
      >
        {/* A single inner span keeps this as one flex item: text and the
            arrow span are direct children of an inline-flex Link, and
            splitting them across two flex items would blockify each one
            (flex items are always blockified), which makes a browser's
            innerText insert a line break between "label" and "→" even
            though nothing visually wraps — breaking the verifier's text
            diff against the live site's single-line link text. */}
        <span>
          {label}
          {arrow ? (
            <>
              {" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover/link:translate-x-1"
              >
                {arrow}
              </span>
            </>
          ) : null}
        </span>
      </Link>
    </div>
  );
}
