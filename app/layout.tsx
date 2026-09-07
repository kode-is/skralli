import type { Metadata } from "next";
import { nowAlt } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  metadataBase: new URL("https://skralli.is"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is" className={nowAlt.variable}>
      <body className="font-sans antialiased text-neutral-900 bg-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
