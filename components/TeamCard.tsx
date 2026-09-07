import Image from "next/image";
import type { Img } from "@/lib/types";

type TeamCardProps = {
  image: Img;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
};

export function TeamCard({ image, name, role, email, phone }: TeamCardProps) {
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
