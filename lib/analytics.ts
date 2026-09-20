/** Google Analytics 4 measurement id for skralli.is (public, not a secret). */
export const GA_MEASUREMENT_ID = "G-3QKMC25CDC";

/** Analytics only ever runs on the real domain, never on localhost, Vercel
 * previews or skralli.vercel.app, so test traffic cannot reach the property. */
const ANALYTICS_HOSTS = new Set(["skralli.is", "www.skralli.is"]);

export function isAnalyticsHost(hostname: string): boolean {
  return ANALYTICS_HOSTS.has(hostname.toLowerCase());
}

export type Consent = "granted" | "denied";

/** localStorage key holding the visitor's cookie choice. */
export const CONSENT_STORAGE_KEY = "skralli-cookie-consent";

/** Window event the footer's "Vafrakökustillingar" link fires to reopen the banner. */
export const CONSENT_REOPEN_EVENT = "skralli:cookie-settings";

/** Only an explicit stored choice counts; anything else means "not asked yet". */
export function parseConsent(raw: string | null | undefined): Consent | null {
  return raw === "granted" || raw === "denied" ? raw : null;
}
