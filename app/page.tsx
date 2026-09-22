import { Database, Layers, Swords, Cherry } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import PokemonImage from "@/components/pokemon/PokemonImage";
import { getPokemonTypeClass } from "@/config/pokemonTypes";
import { getDashboardData } from "@/server/dashboard/dashboard.service";
import { MappedPokemon } from "@/server/pokemon/pokemon.mapper";

export const metadata: Metadata = {
  title: "Übersicht – PokéLab",
  description: "Forschungszentrum für Pokémon-Daten: Statistiken und aktuelle Einträge aus dem Pokédex, den Attacken, Fähigkeiten und Beeren.",
};

export default async function Dashboard() {
  const { stats, pokemon } = await getDashboardData();

  const cards = [
    {
      title: "Pokémon",
      value: stats.pokemonCount,
      icon: Database,
      link: "/pokemon",
    },
    {
      title: "Fähigkeiten",
      value: stats.abilityCount,
      icon: Layers,
      link: "/abilities",
    },
    {
      title: "Attacken",
      value: stats.moveCount,
      icon: Swords,
      link: "/moves",
    },
    {
      title: "Beeren",
      value: stats.berryCount,
      icon: Cherry,
      link: "/berries",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <h1 className="text-5xl font-bold text-white">Willkommen im PokéLabs</h1>

        <p className="mt-3 text-xl text-slate-400">Forschungszentrum für Pokémon-Daten, Moves und Fähigkeiten.</p>
      </section>

      {/* Statistik */}
      <section className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link href={card.link} key={card.title} className="group">
              <div
                key={card.title}
                className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
                shadow-lg
                transition
                hover:border-slate-700
              "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="pb-2 text-sm text-slate-400">{card.title}</p>

                    <strong className="text-4xl text-white">{card.value}</strong>
                  </div>

                  <div
                    className="
                    rounded-xl
                    bg-red-500/10
                    p-3
                    text-red-400
                  "
                  >
                    <Icon size={32} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Pokemon */}
      <section>
        <div className="mb-8">
          <h2 className="pb-1.5 text-3xl font-bold text-white">Pokémon Datenbank</h2>

          <p className="text-md text-slate-400">Aktuelle Einträge aus dem Pokédex</p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pokemon.map((poke: MappedPokemon) => (
            <Link
              href={`/pokemon/${poke.id}`}
              key={poke.id}
              className="
                group
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-5
                shadow-lg
                transition-all
                hover:-translate-y-1
                hover:border-slate-700
                hover:shadow-xl
                hover:shadow-red-500/10
              "
            >
              {/* Bild */}
              <div
                className="
                  flex
                  justify-center
                  rounded-xl
                  bg-slate-800/50
                  p-4
                "
              >
                <PokemonImage src={poke.image} alt={poke.name} />
              </div>

              {/* Info */}
              <div className="mt-4">
                <strong className="text-md text-slate-500">#{String(poke.id).padStart(3, "0")}</strong>

                <h3 className="text-xl font-bold text-white">{poke.name}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {poke.types.map((type: { slug: string; name: string }) => (
                    <span
                      key={type.slug}
                      className={`
                          flex
                          h-6
                          w-20
                          items-center
                          justify-center
                          rounded-full
                          text-xs
                          font-semibold
                          text-white
                          ${getPokemonTypeClass(type.slug)}
                        `}
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
