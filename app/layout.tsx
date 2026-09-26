import type { Metadata } from "next";

//CSS
import "./globals.css";

//Components
import Navigation from "@/components/layout/Navigation";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pokelabs.de"),
  title: {
    default: "PokéLabs - Pokémon Research Database",
    template: "%s - PokéLabs",
  },
  description: "Durchsuche Pokémon, Attacken, Fähigkeiten, Items und Beeren mit deutschen Übersetzungen und detaillierten Werten.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "PokéLabs",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={cn("dark font-sans", geist.variable)}>
      <body className="bg-slate-950 text-slate-100">
        <AuthSessionProvider>
          <div className="min-h-screen min-[1200px]:grid min-[1200px]:grid-cols-[240px_1fr]">
            <Navigation />

            <main className="pb-6 md:pb-8 md:px-6">{children}</main>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
