import { Container } from "@/components/Container";
import { jumpLinks, jumpNavLabel } from "@/lib/fyrirokumannin";

/** The page's four products as jump links, straight under the breadcrumb. */
export function JumpNav() {
  return (
    <nav aria-label={jumpNavLabel} className="bg-white pt-8 md:pt-12">
      <Container>
        <ul className="flex flex-wrap gap-2 md:gap-2.5">
          {jumpLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E3E9F2] bg-white px-4 py-2 font-ui text-[13px] font-medium text-[#171717] transition-colors duration-200 hover:border-brand-dark hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid md:text-sm"
              >
                {link.text}
                <span aria-hidden="true" className="text-brand-dark">
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
