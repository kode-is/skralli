import { describe, expect, it } from "vitest";
import { GA_MEASUREMENT_ID, isAnalyticsHost, parseConsent } from "@/lib/analytics";

describe("analytics gating", () => {
  it("uses the measurement id Einar supplied", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-3QKMC25CDC");
  });

  it("only counts the real domain", () => {
    expect(isAnalyticsHost("skralli.is")).toBe(true);
    expect(isAnalyticsHost("www.skralli.is")).toBe(true);
    expect(isAnalyticsHost("SKRALLI.IS")).toBe(true);
    for (const host of ["localhost", "skralli.vercel.app", "skralli-abc-kode-solutions.vercel.app", "evil-skralli.is", "skralli.is.evil.com", ""]) {
      expect(isAnalyticsHost(host), host).toBe(false);
    }
  });

  it("treats anything but an explicit stored choice as undecided", () => {
    expect(parseConsent("granted")).toBe("granted");
    expect(parseConsent("denied")).toBe("denied");
    for (const raw of [null, undefined, "", "yes", "true", "GRANTED"]) {
      expect(parseConsent(raw as string | null)).toBe(null);
    }
  });
});
