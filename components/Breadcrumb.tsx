import Link from "next/link";
import { Container } from "@/components/Container";

export type BreadcrumbItem = { text: string; href?: string };

/**
 * The breadcrumb bar from skralli-v2 (src/components/PageHero.tsx there):
 * a slim, full-width tinted bar sitting directly under the page hero, with
 * a hairline bottom border, 14 px Inter, "›" separators, muted links that
 * turn brand blue on hover, and the current page in dark medium weight.
 * It renders its own full-bleed background and the site Container, so pages
 * place it as a direct child of <main>, right after <PageHero>.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const entries: BreadcrumbItem[] = [{ text: "Forsíða", href: "/" }, ...items];
  const lastIndex = entries.length - 1;

  return (
    <nav aria-label="Brauðmolaslóð" className="border-b border-[#dce5f0] bg-[#f0f4fa]">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 py-4 font-ui text-sm text-[#4a5568]">
          {entries.map((item, index) => {
            const isCurrent = index === lastIndex;
            return (
              <li key={`${index}-${item.text}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">›</span> : null}
                {isCurrent || !item.href ? (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={isCurrent ? "font-medium text-[#171717]" : undefined}
                  >
                    {item.text}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-mid"
                  >
                    {item.text}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
