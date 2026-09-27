import { Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import Link from "next/link";

import { PokemonPageProps, VALID_SORTS } from "@/app/pokemon/page.constants";
import { glassCard, glassIconBox } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import StickyBar from "@/components/layout/StickyBar";
import MyPokemonGrid from "@/components/pokemon/MyPokemonGrid";
import PokemonFilters from "@/components/pokemon/PokemonFilters";
import { sections } from "@/config/sections";
import { authOptions } from "@/server/auth/authOptions";
import { getFavoritePokemonList } from "@/server/pokemon/favorites.service";
import { PokemonSort } from "@/server/pokemon/pokemon.service";
import { getAllTypes } from "@/server/type/type.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meine Pokémon",
  description: "Deine favorisierten Pokémon auf einen Blick.",
  alternates: { canonical: "/meine-pokemon" },
};

export default async function MeinePokemonPage({ searchParams }: PokemonPageProps) {
  const session = await getServerSession(authOptions);

  const { search = "", types: typesParam = "", generations: generationsParam = "", sort: sortParam } = await searchParams;

  const selectedTypes = typesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const selectedGenerations = generationsParam
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  const sort = VALID_SORTS.includes(sortParam as PokemonSort) ? (sortParam as PokemonSort) : "number-asc";

  return (
    <SectionTheme accent={sections.myPokemon.accent} accent2={sections.myPokemon.accent2}>
      <PageHeader section={sections.myPokemon} />

      {!session?.user?.id ? (
        <section className="px-4 py-6">
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
        </section>
      ) : (
        await renderFavorites(session.user.id, { search, types: selectedTypes, generations: selectedGenerations, sort })
      )}
    </SectionTheme>
  );
}

async function renderFavorites(
  userId: string,
  filters: { search: string; types: string[]; generations: number[]; sort: PokemonSort },
) {
  const [pokemon, types] = await Promise.all([getFavoritePokemonList(userId, filters), getAllTypes()]);

  return (
    <>
      <StickyBar>
        <PokemonFilters types={types} search={filters.search} selectedTypes={filters.types} selectedGenerations={filters.generations} sort={filters.sort} />
      </StickyBar>

      <section className="px-4 py-6">
        <MyPokemonGrid pokemon={pokemon} />
      </section>
    </>
  );
}
