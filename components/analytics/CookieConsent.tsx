"use client";

import Script from "next/script";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_REOPEN_EVENT,
  CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  isAnalyticsHost,
  parseConsent,
  type Consent,
} from "@/lib/analytics";

function readStoredConsent(): Consent | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null; // storage blocked: ask again next visit, never assume consent
  }
}

function storeConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // storage blocked: the choice simply lasts for this page view
  }
}

/** Withdrawing consent must actually stop the measurement, not just hide it. */
function removeAnalyticsCookies() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid");
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Cookie consent banner plus the Google Analytics loader.
 *
 * Analytics is strictly opt-in: nothing from Google is requested, and no
 * cookie is set, until the visitor presses "Samþykkja". "Hafna" is just as
 * prominent and just as easy, and the footer's "Vafrakökustillingar" link
 * reopens the banner so a choice can be changed or withdrawn at any time.
 * The loader additionally refuses to run anywhere but the real domain.
 */
export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [canMeasure, setCanMeasure] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    setConsent(stored);
    setOpen(stored === null);
    setCanMeasure(isAnalyticsHost(window.location.hostname));
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  const choose = useCallback(
    (value: Consent) => {
      const wasGranted = consent === "granted";
      storeConsent(value);
      setConsent(value);
      setOpen(false);
      if (value === "denied" && wasGranted) {
        removeAnalyticsCookies();
        // The Google script is already in the page; a reload is the only way to unload it.
        window.location.reload();
      }
    },
    [consent],
  );

  return (
    <>
      {consent === "granted" && canMeasure ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      ) : null}

      <AnimatePresence>
        {open ? (
          <m.section
            aria-label="Vafrakökur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="motion-fade fixed inset-x-4 bottom-4 z-[80] rounded-[15px] border border-[#E3E9F2] bg-white p-5 shadow-[0_18px_50px_-18px_rgba(0,26,40,0.45)] md:inset-x-auto md:bottom-6 md:left-6 md:w-[420px] md:p-6"
          >
            <h2 className="font-ui text-base font-semibold text-[#171717]">Vafrakökur</h2>
            <p className="mt-2 font-ui text-sm leading-[1.6] text-[#444444]">
              Við notum Google Analytics til að mæla umferð um vefinn og bæta hann. Engar vafrakökur eru
              settar nema þú samþykkir, og þú getur breytt valinu hvenær sem er neðst á síðunni.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="flex-1 border border-brand-dark px-6 py-3 text-[15px] font-semibold text-brand-dark transition-colors duration-200 hover:bg-[#f0f4fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid"
              >
                Hafna
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="flex-1 border border-brand-dark bg-brand-dark px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-brand-mid hover:bg-brand-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid"
              >
                Samþykkja
              </button>
            </div>
          </m.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
