import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/categories";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className="group block overflow-hidden rounded-2xl bg-[#f0f4fa] transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h5 className="text-lg font-bold text-neutral-900">{category.title}</h5>
        <p className="mt-2 text-sm text-neutral-600">{category.blurb}</p>
      </div>
    </Link>
  );
}
