import { Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import Link from "next/link";

import { glassCard, glassIconBox } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import PokemonCard from "@/components/pokemon/PokemonCard";
import { sections } from "@/config/sections";
import { authOptions } from "@/server/auth/authOptions";
import { getFavoritePokemonList } from "@/server/pokemon/favorites.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meine Pokémon",
  description: "Deine favorisierten Pokémon auf einen Blick.",
  alternates: { canonical: "/meine-pokemon" },
};

export default async function MeinePokemonPage() {
  const session = await getServerSession(authOptions);

  return (
    <SectionTheme accent={sections.myPokemon.accent} accent2={sections.myPokemon.accent2}>
      <PageHeader section={sections.myPokemon} />

      <section className="px-4 py-6">
        {!session?.user?.id ? (
          <div className={`${glassCard} mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center`}>
            <GlassBlobs />

            <div className={`${glassIconBox} flex size-14 items-center justify-center`}>
              <Lock size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Anmeldung erforderlich</h2>
              <p className="mt-1.5 text-sm text-white/70">Melde dich an, um deine favorisierten Pokémon zu sehen und zu verwalten.</p>
            </div>

            <Link
              href="/login?callbackUrl=/meine-pokemon"
              className="rounded-xl border border-white/20 bg-[linear-gradient(135deg,var(--accent),var(--accent-2,var(--accent)))] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_var(--accent),inset_0_1px_0_rgb(255_255_255/0.3)] transition hover:brightness-110"
            >
              Jetzt anmelden
            </Link>
          </div>
        ) : (
          await renderFavorites(session.user.id)
        )}
      </section>
    </SectionTheme>
  );
}

async function renderFavorites(userId: string) {
  const pokemon = await getFavoritePokemonList(userId);

  if (pokemon.length === 0) {
    return <p className="text-center text-slate-500">Du hast noch keine Pokémon favorisiert. Klicke auf das Herz-Symbol bei einem Pokémon.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {pokemon.map((poke) => (
        <PokemonCard key={poke.id} pokemon={poke} />
      ))}
    </div>
  );
}
