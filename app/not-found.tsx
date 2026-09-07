import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/404/01-d1eed4a4.jpg"
        alt="Handyman working"
        width={1440}
        height={959}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center text-white">
        <h1 className="text-7xl font-bold md:text-8xl">404</h1>
        <h2 className="max-w-xl text-lg font-medium md:text-xl">
          Síðan sem þú ert að leita að er ekki til eða hefur verið færð. Vinsamlegast farðu
          aftur á heimasíðuna.
        </h2>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-sm font-semibold transition hover:bg-white hover:text-neutral-900"
        >
          Heim
        </Link>
      </div>
    </div>
  );
}
