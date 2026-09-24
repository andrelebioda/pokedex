import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { glassCard } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import { accentStyle } from "@/config/sections";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Diese Seite existiert nicht. Zurück zur Übersicht oder zum Pokédex.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div style={accentStyle("#facc15", "#f97316")} className={`${glassCard} mx-auto w-full max-w-2xl px-6 py-10 text-center md:py-14`}>
        <GlassBlobs />
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" />

            <Image
              // src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              src="/pikachu-running.gif"
              alt="Pikachu"
              width={200}
              height={200}
              priority
              className="relative animate-float object-contain"
            />
          </div>
        </div>

        <div className="mb-2 text-7xl font-black text-white drop-shadow-[0_4px_20px_rgb(250_204_21/0.6)] md:text-8xl">404</div>

        <h1 className="mb-8 text-2xl font-bold text-white md:text-4xl">Pikachu hat nichts gefunden ⚡</h1>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="
              rounded-full
              bg-yellow-400
              px-6
              py-3
              font-semibold
              text-slate-950
              transition
              hover:scale-105
            "
          >
            Zur Übersicht
          </Link>

          <Link
            href="/pokemon"
            className="
              rounded-full
              border
              border-white/20
              bg-white/10
              backdrop-blur-md
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:border-white/20
            "
          >
            Pokédex öffnen
          </Link>
        </div>

        <div className="mt-10 text-sm text-white/60">Fehlercode #404</div>
      </div>
    </div>
  );
}
