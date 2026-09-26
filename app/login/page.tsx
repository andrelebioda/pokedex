import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";
import { glassCard } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import SectionTheme from "@/components/layout/SectionTheme";
import { sections } from "@/config/sections";

export const metadata: Metadata = {
  title: "Anmelden - PokéLabs",
  description: "Melde dich bei PokéLabs an.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <SectionTheme accent={sections.home.accent} accent2={sections.home.accent2}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 md:min-h-screen">
        <div className={`${glassCard} w-full max-w-md p-6 md:p-8`}>
          <GlassBlobs />

          <h1 className="text-2xl font-bold text-white md:text-3xl">Willkommen zurück</h1>
          <p className="mt-1.5 text-sm text-white/70">Melde dich an, um PokéLabs mit deinem Konto zu nutzen.</p>

          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </SectionTheme>
  );
}
