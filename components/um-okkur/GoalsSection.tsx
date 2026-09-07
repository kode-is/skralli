import Image from "next/image";
import type { SVGProps } from "react";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

// docs/scrape/um-okkur.json blocks 10-16. The three checklist items repeat
// the site motto (lib/site.ts `motto`) rather than hardcoding the copy again.
const HEADING = "Markmið okkar.";
const TEXT =
  "Okkar markmið er að skapa traust og ánægju viðskiptavina. Við einsetjum okkur að fylgja þér alla leið og tryggja að þú fáir það sem þú þarfnast til að ná sem mestum árangri.";
const CHECKLIST = site.motto.split(" - ");

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoalsSection() {
  return (
    <section className="bg-white pb-16 md:pb-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm md:mx-0">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <Image
              src="/images/um-okkur/04-ab45b0b4.jpeg"
              alt="Interior work"
              fill
              sizes="(min-width: 768px) 33vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 aspect-[3/4] w-2/5 overflow-hidden rounded-2xl ring-4 ring-white">
            <Image
              src="/images/um-okkur/05-baa00a71.jpg"
              alt="Bedroom work"
              fill
              sizes="(min-width: 768px) 15vw, 35vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{HEADING}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
            {TEXT}
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <h4 className="font-semibold text-neutral-900">{item}</h4>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
