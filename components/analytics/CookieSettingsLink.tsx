"use client";

import { CONSENT_REOPEN_EVENT } from "@/lib/analytics";

/** Footer control that reopens the cookie banner, so consent can be changed
 * or withdrawn as easily as it was given. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className={className}
    >
      Vafrakökustillingar
    </button>
  );
}
