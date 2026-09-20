import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { pageMetadata } from "@/lib/seo";
import { privacyPolicy } from "@/lib/privacy";

export const metadata: Metadata = pageMetadata({
  title: `${privacyPolicy.title} - Skralli`,
  description: privacyPolicy.description,
  path: privacyPolicy.path,
});

export default function PersonuverndPage() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/hafa-samband/01-7ea80875.jpeg", alt: "", width: 512, height: 341 }}
        title={privacyPolicy.title}
      />
      <Breadcrumb items={[{ text: privacyPolicy.title }]} />
      <section className="bg-white py-16 md:py-24">
        <Container>
          <p className="max-w-[720px] text-base leading-[1.9] text-[#444444] md:text-lg">{privacyPolicy.intro}</p>
          <div className="mt-12 flex max-w-[820px] flex-col gap-10 md:mt-14">
            {privacyPolicy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl leading-[1.3] font-semibold text-[#171717] md:text-[28px]">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-base leading-[1.8] text-[#444444]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <p className="font-ui text-[13px] text-[#4a5568]">{privacyPolicy.updated}</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
