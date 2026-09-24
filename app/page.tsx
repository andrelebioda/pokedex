import type { CSSProperties } from "react";
import { ArrowRight, Calculator, Heart, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import PokemonCard from "@/components/pokemon/PokemonCard";
import { sections } from "@/config/sections";
import { getDashboardData } from "@/server/dashboard/dashboard.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Übersicht - PokéLabs",
  description: "Forschungszentrum für Pokémon-Daten: Statistiken und aktuelle Einträge aus dem Pokédex, den Attacken, Fähigkeiten und Beeren.",
  alternates: { canonical: "/" },
};

const plannedFeatures = [
  { title: "Team Builder", icon: Users },
  { title: "EVs/IVs-Rechner", icon: Calculator },
  { title: "Meine Pokémon", description: "Sammle deine favorisierten Pokémon", icon: Heart },
];

export default async function Dashboard() {
  const { stats, pokemon } = await getDashboardData();

  const cards = [
    { section: sections.pokemon, value: stats.pokemonCount },
    { section: sections.abilities, value: stats.abilityCount },
    { section: sections.moves, value: stats.moveCount },
    { section: sections.berries, value: stats.berryCount },
  ];

  return (
    <div className="space-y-12 px-4 pt-6 pb-10">
      {/* Header */}
      <section
        className="
          relative
          isolate
          overflow-hidden
          rounded-3xl
          border
          border-white/5
          bg-slate-900
          bg-[radial-gradient(circle_at_top_right,rgb(239_68_68/0.25),transparent_55%),radial-gradient(circle_at_bottom_left,rgb(99_144_240/0.12),transparent_50%)]
          p-6
          shadow-lg
          md:p-10
        "
      >
        {/* Pokéball als Wasserzeichen */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            -top-16
            -right-16
            -z-10
            hidden
            size-80
            rounded-full
            border-[28px]
            border-white/5
            md:block
          "
        >
          <div className="absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 bg-white/5" />
          <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[28px] border-white/5 bg-slate-900" />
        </div>

        <span
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-red-500/30
            bg-red-500/10
            px-3
            py-1
            text-xs
            font-semibold
            text-red-300
          "
        >
          <span className="size-2 animate-pulse rounded-full bg-red-400" />
          Fanprojekt · in Entwicklung
        </span>

        <h1 className="mt-4 text-3xl font-bold text-white md:text-5xl">
          Willkommen im <span className="bg-linear-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">PokéLabs</span>
        </h1>

        <p className="mt-4 w-full text-[16px] text-slate-400 md:text-[20px] xl:w-[75%]">
          Hier findest du umfangreiche Informationen zu allen Pokémon, Attacken, Fähigkeiten, Items und Beeren. Die Seite ist ein reines Fanprojekt
          von mir und befindet sich noch in der Entwicklung.
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Demnächst geplant</p>

          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {plannedFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <li
                  key={feature.title}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/5
                    bg-slate-800/50
                    p-3
                  "
                >
                  <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-white">{feature.title}</p>
                    {feature.description && <p className="truncate text-sm text-slate-400">{feature.description}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
        {cards.map(({ section, value }) => {
          const Icon = section.icon;

          return (
            <Link
              href={section.href}
              key={section.href}
              style={{ "--accent": section.accent } as CSSProperties}
              className="
                group
                relative
                isolate
                overflow-hidden
                rounded-3xl
                border
                border-white/5
                bg-slate-900
                bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]
                p-4
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]
                hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_60%,transparent)]
                md:p-6
              "
            >
              {/* Icon als Wasserzeichen */}
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="
                  pointer-events-none
                  absolute
                  -right-4
                  -bottom-4
                  -z-10
                  size-24
                  text-white/5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  group-hover:-rotate-6
                  md:size-32
                "
              />

              <div className="flex items-start justify-between gap-2">
                <div className="rounded-xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] p-2 text-(--accent) md:p-3">
                  <Icon className="size-6 md:size-7" />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-(--accent)"
                />
              </div>

              <strong className="mt-4 block text-2xl text-white md:mt-6 md:text-4xl">{value.toLocaleString("de-DE")}</strong>

              <p className="mt-1 text-sm text-slate-400">{section.name}</p>

              {/* Akzent unten */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-(--accent) opacity-70" />
            </Link>
          );
        })}
      </section>

      {/* Pokemon */}
      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h2 className="pb-1.5 text-[20px] font-bold text-white md:text-3xl">Pokémon Datenbank</h2>

            <p className="text-[16px] text-slate-400 md:text-lg">Zufällige Einträge aus dem Pokédex</p>
          </div>

          <Link
            href="/pokemon"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-slate-900
              px-4
              py-2
              text-sm
              font-semibold
              text-slate-300
              transition
              hover:border-red-500/40
              hover:text-white
            "
          >
            Alle Pokémon
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pokemon.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      </section>
    </div>
  );
}
