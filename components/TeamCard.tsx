import Image from "next/image";
import type { Img } from "@/lib/types";

type TeamCardProps = {
  image: Img;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  /**
   * "compact" (default): small rounded photo + name below, used by the home
   * page's AdvisorySection teaser.
   * "profile": full-width photo with role/name/contact below on a plain
   * background, used by the /um-okkur team grid. Per the live site's
   * server-rendered HTML, email/phone there are plain <h6> text, not links,
   * so this variant never renders them as anchors.
   */
  variant?: "compact" | "profile";
};

export function TeamCard({ image, name, role, email, phone, variant = "compact" }: TeamCardProps) {
  if (variant === "profile") {
    return (
      <div className="flex flex-col">
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-4">
          {role ? (
            <h6 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {role}
            </h6>
          ) : null}
          <h3 className="mt-1 text-lg font-bold text-neutral-900">{name}</h3>
          {email || phone ? (
            <div className="mt-1 flex items-center justify-between gap-3">
              {email ? (
                <h6 className="truncate text-xs uppercase tracking-wide text-neutral-500">
                  {email}
                </h6>
              ) : null}
              {phone ? (
                <h6 className="shrink-0 text-xs uppercase tracking-wide text-neutral-500">
                  {phone}
                </h6>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Image
        src={image.src}
        alt={image.alt || name}
        width={image.width}
        height={image.height}
        className="h-[63px] w-[96px] rounded-xl object-cover md:h-[90px] md:w-[136px]"
      />
      <div>
        <p className="font-semibold text-neutral-900">{name}</p>
        {role ? <p className="text-sm text-neutral-600">{role}</p> : null}
        {email ? (
          <a href={`mailto:${email}`} className="block text-sm text-brand-dark hover:underline">
            {email}
          </a>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="block text-sm text-brand-dark hover:underline">
            {phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}
