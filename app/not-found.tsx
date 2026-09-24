import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Diese Seite existiert nicht. Zurück zur Übersicht oder zum Pokédex.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div
        className="
          relative
          isolate
          mx-auto
          w-full
          max-w-2xl
          overflow-hidden
          rounded-3xl
          border
          border-white/5
          bg-slate-900
          bg-[radial-gradient(circle_at_top,rgb(250_204_21/0.18),transparent_60%)]
          px-6
          py-10
          text-center
          shadow-lg
          md:py-14
        "
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-3xl" />

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

        <div className="mb-2 text-7xl font-black text-yellow-400 md:text-8xl">404</div>

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
              border-white/10
              bg-slate-800/60
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

        <div className="mt-10 text-sm text-slate-500">Fehlercode #404</div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-yellow-400 opacity-70" />
      </div>
    </div>
  );
}
