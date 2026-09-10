"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Shares the inquiry card's collapsed/expanded state (design.dc.html 1a/1b/1d
// "Fyrirspurnarkort — stöður") between InquiryCard itself and
// MobileQuoteBar, the sticky "Fá tilboð" bar rendered elsewhere in the
// product page tree — clicking the bar has to open the same card instance,
// not a second copy of the form.
type InquiryContextValue = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return <InquiryContext.Provider value={{ expanded, setExpanded }}>{children}</InquiryContext.Provider>;
}

export function useInquiry(): InquiryContextValue {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return context;
}
