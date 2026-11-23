import { DetailsFaq } from "@/components/DetailsFaq";
import type { Brand } from "@/lib/brands";

export function BrandFaq({ brand }: { brand: Brand }) {
  return <DetailsFaq heading={`Spurt og svarað um ${brand.name}`} items={brand.faq} />;
}
