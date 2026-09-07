import Link from "next/link";
import { Container } from "@/components/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/lib/categories";

export function CategoriesSection() {
  const homeCategories = categories.filter((category) => category.onHome);

  return (
    <section className="bg-[#f0f4fa] py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Okkar vöruframboð</h2>
          <div className="flex flex-col gap-4 md:items-end">
            <Link
              href="/thjonusta"
              className="inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid"
            >
              Skoðaðu úrvalið
            </Link>
            <p className="max-w-sm text-sm text-neutral-600 md:text-right">
              Við leggjum áherslu á vörugæði og framúrskarandi þjónustu.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
