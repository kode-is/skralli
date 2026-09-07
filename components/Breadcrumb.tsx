import Link from "next/link";

export type BreadcrumbItem = { text: string; href?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Brauðmolaslóð" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-neutral-500">
        <li>
          <Link href="/" className="transition hover:text-brand-dark">
            Forsíða
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.text} className="flex items-center gap-2">
              <span aria-hidden="true">&gt;</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-brand-dark">
                  {item.text}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-neutral-900" : ""}>
                  {item.text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
