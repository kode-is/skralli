import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/categories";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category.id];

  return (
    <Link
      href={category.href}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {Icon ? (
          <span className="absolute -bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark text-white shadow-md">
            <Icon className="h-6 w-6" />
          </span>
        ) : null}
      </div>
      <div className="p-6 pt-8">
        <h5 className="font-ui text-lg font-semibold text-neutral-900">{category.title}</h5>
        <p className="mt-2 text-sm text-neutral-600">{category.blurb}</p>
      </div>
    </Link>
  );
}
