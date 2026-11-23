import { DetailsFaq } from "@/components/DetailsFaq";
import { faqItems } from "@/lib/faq";

export function FaqSection() {
  return <DetailsFaq heading="Spurt & Svarað" items={faqItems} />;
}
