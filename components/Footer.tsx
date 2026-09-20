import { CookieSettingsLink } from "@/components/analytics/CookieSettingsLink";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { site, footerColumns } from "@/lib/site";

type FooterColumn = (typeof footerColumns)[number];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M15 8.5h2V5.5h-2c-2.21 0-4 1.79-4 4v2H9v3h2v6.5h3V14.5h2.2l.8-3H14v-2c0-.55.45-1 1-1Z"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth={1.3} />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth={1.3} />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Separator between the bottom-bar items; the row stacks on mobile, so it
 *  only shows once the items sit on one line. */
function Dot() {
  return (
    <span aria-hidden="true" className="hidden text-neutral-300 md:inline">
      ·
    </span>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f4fa] text-brand-dark">
        {icon}
      </span>
      <span className="text-left">
        <span className="block font-ui text-xs text-neutral-500">{label}</span>
        <span className="block text-sm text-neutral-900">{children}</span>
      </span>
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3 6 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 11 9 17 15.4 17A1.5 1.5 0 0 0 17 15.5v-2l-3.5-1.5-1.6 1.8a11.6 11.6 0 0 1-4.7-4.7L9 7.5 7.5 4l-1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4.3l2.8 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FooterLinkColumn({ column, className }: { column: FooterColumn; className?: string }) {
  return (
    <div className={className}>
      <h4 className="mb-4 font-ui font-semibold text-neutral-900">{column.heading}</h4>
      <ul className="space-y-3">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-sm text-neutral-600 transition hover:text-brand-dark"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [fyrirtaekid, vorumerki, thjonusta] = footerColumns;

  return (
    <footer className="bg-white py-16 md:py-20">
      <Container>
        {/* Mobile shows only the "Fyrirtækið" column above the company
            block; "Vörumerki" and "Þjónusta" are desktop-only. On desktop
            the blocks sit left-to-right: company identity, the three link
            columns, then the contact details. See
            docs/reference/home.desktop.jpg and docs/reference/home.mobile.jpg. */}
        <div className="flex flex-col items-center gap-12 text-center md:grid md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr_1.1fr] md:items-start md:gap-8 md:text-left">
          <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:items-start">
            <Link href="/" aria-label="Skralli - Forsíða">
              <Image
                src="/logos/skralli-footer.png"
                alt="Skralli"
                width={537}
                height={146}
                className="h-auto w-[178px]"
              />
            </Link>
            <p className="font-ui text-neutral-900">{site.motto}</p>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>{site.address}</p>
              <p>{site.kennitala}</p>
            </div>
            <div className="flex items-center gap-4 text-neutral-900">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Skralli á Facebook"
                className="transition hover:text-brand-dark"
              >
                <FacebookIcon />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Skralli á Instagram"
                className="transition hover:text-brand-dark"
              >
                <InstagramIcon />
              </a>
            </div>
            <Image
              src="/images/footer/fyrirmyndarfyrirtaeki-2025-2026.png"
              alt="Fyrirmyndarfyrirtæki í rekstri 2025–2026 — Viðskiptablaðið / Keldan"
              width={151}
              height={107}
              className="mt-2"
            />
          </div>

          <FooterLinkColumn column={fyrirtaekid} className="order-1 md:order-2" />
          <FooterLinkColumn column={vorumerki} className="hidden md:order-3 md:block" />
          <FooterLinkColumn column={thjonusta} className="hidden md:order-4 md:block" />

          {/* Phone, email and opening hours as labelled rows rather than more
              lines in the address block, which ran to six stacked lines. */}
          <div className="order-3 flex flex-col items-center gap-5 md:order-5 md:items-start">
            <ContactRow icon={<MailIcon />} label="Netfang">
              <a
                href={`mailto:${site.email}`}
                className="transition-colors duration-200 hover:text-brand-dark"
              >
                {site.email}
              </a>
            </ContactRow>
            <ContactRow icon={<PhoneIcon />} label="Sími">
              <a
                href={site.phoneHref}
                className="transition-colors duration-200 hover:text-brand-dark"
              >
                {site.phoneLocal}
              </a>
            </ContactRow>
            <ContactRow icon={<ClockIcon />} label="Opnunartími">
              {site.hoursValue}
            </ContactRow>
          </div>
        </div>
        {/* Not on the live site: required so a visitor can change or withdraw
            their cookie choice (components/analytics/CookieConsent.tsx). */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-neutral-200 pt-6 text-center md:flex-row md:gap-x-3 md:text-left">
          <Link
            href="/personuvernd"
            className="font-ui text-xs text-neutral-500 underline underline-offset-2 transition-colors duration-200 hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid"
          >
            Persónuverndarstefna
          </Link>
          <Dot />
          <CookieSettingsLink className="font-ui text-xs text-neutral-500 underline underline-offset-2 transition-colors duration-200 hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid" />
          <Dot />
          <p className="font-ui text-xs text-neutral-500">
            © 2026 Skralli ehf. - Allur réttur áskilinn
          </p>
        </div>
      </Container>
    </footer>
  );
}
