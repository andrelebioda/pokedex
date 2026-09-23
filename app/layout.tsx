import type { Metadata } from "next";

//CSS
import "./globals.css";

//Components
import Navigation from "@/components/layout/Navigation";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "PokéLab – Pokémon Research Database",
    template: "%s – PokéLab",
  },
  description: "Durchsuche Pokémon, Attacken, Fähigkeiten, Items und Beeren mit deutschen Übersetzungen und detaillierten Werten.",
  openGraph: {
    siteName: "PokéLab",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={cn("dark font-sans", geist.variable)}>
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen min-[1200px]:grid min-[1200px]:grid-cols-[240px_1fr]">
          <Navigation />

          <main className="px-2 pb-6 md:pb-8 md:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
