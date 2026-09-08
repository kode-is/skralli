// Shared per-page <head> boilerplate: canonical link, Open Graph, Twitter
// card and the robots meta tag, all derived from a page's own title,
// description and path. Reproduces what every route on the live site
// (skralli.is) emits — confirmed against curl'd <head> output for `/`,
// `/vorumerki/bmair`, `/sturtuvagnar/gw-100` and
// `/hifi-festibunadur/hifikedjur`:
//   <link rel="canonical" href="https://skralli.is<path>">
//   <meta property="og:title" content="<title>">
//   <meta property="og:description" content="<description>">
//   <meta property="og:type" content="website">
//   <meta property="og:url" content="https://skralli.is<path>">
//   <meta name="twitter:card" content="summary_large_image">
//   <meta name="twitter:title" content="<title>">
//   <meta name="twitter:description" content="<description>">
//   <meta name="robots" content="max-image-preview:large">
// The live site has no og:image, so none is set here either. The
// apple-touch-icon (`app/apple-icon.png`) is a separate Next.js
// file-convention icon and isn't part of this helper.
import type { Metadata } from "next";

const SITE_URL = "https://skralli.is";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "Skralli",
      locale: "is_IS",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      "max-image-preview": "large",
    },
  };
}
