import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Diese Seite existiert nicht. Zurück zur Übersicht oder zum Pokédex.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
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

        <div className="mb-2 text-8xl font-black text-yellow-400">404</div>

        <h1 className="mb-4 text-4xl font-bold text-white">Pikachu hat nichts gefunden ⚡</h1>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="
              rounded-xl
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
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:border-slate-600
            "
          >
            Pokédex öffnen
          </Link>
        </div>

        <div className="mt-10 text-sm text-slate-500">Fehlercode #404</div>
      </div>
    </div>
  );
}
