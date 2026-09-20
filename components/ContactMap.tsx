"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const QUERY = `Skralli ehf, ${site.address}`;

/**
 * Google Maps embed for the contact page, behind a click.
 *
 * The consent banner promises "Engar vafrakökur eru settar nema þú
 * samþykkir" (components/analytics/CookieConsent.tsx). A Maps iframe sets
 * Google cookies the moment it loads, so rendering one on page load would
 * break that promise before the visitor has chosen anything. Nothing is
 * requested from Google until the visitor asks for the map.
 *
 * The plain link below the map is always available, so the address is
 * reachable without loading the embed at all.
 */
export function ContactMap() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-[#f0f4fa]">
        {showMap ? (
          <iframe
            title={`Kort af staðsetningu Skralla - ${site.address}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(QUERY)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block aspect-[4/3] w-full border-0 md:aspect-[21/9]"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 px-6 text-center md:aspect-[21/9]">
            <MapPinIcon />
            <div>
              <p className="font-ui text-base font-semibold text-neutral-900">{site.address}</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-600">
                Kortið er frá Google og setur vafrakökur þegar það hleðst. Smelltu til að opna það.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="rounded-[10px] bg-brand-dark px-[30px] py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-brand-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid"
            >
              Sýna kort
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-sm text-brand-dark underline underline-offset-2 transition-colors duration-200 hover:text-brand-mid"
        >
          Opna í Google Maps
        </a>
      </p>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-brand-dark" aria-hidden="true">
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
