import localFont from "next/font/local";

export const nowAlt = localFont({
  variable: "--font-now",
  display: "swap",
  src: [
    { path: "../assets/fonts/NowAlt-Thin.woff", weight: "100", style: "normal" },
    { path: "../assets/fonts/NowAlt-Light.woff", weight: "300", style: "normal" },
    { path: "../assets/fonts/NowAlt-Regular.woff", weight: "400", style: "normal" },
    { path: "../assets/fonts/NowAlt-Medium.woff", weight: "500", style: "normal" },
    { path: "../assets/fonts/NowAlt-Bold.woff", weight: "700", style: "normal" },
    { path: "../assets/fonts/NowAlt-Black.woff", weight: "900", style: "normal" },
  ],
});
