import { ArrowRight, Calculator, Heart, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { glassCard, glassIconBox, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import PokemonCard from "@/components/pokemon/PokemonCard";
import { accentStyle, sections } from "@/config/sections";
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
    <SectionTheme accent={sections.home.accent} accent2={sections.home.accent2}>
      <PageHeader
        section={sections.home}
        eyebrow={
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            <span className="size-2 animate-pulse rounded-full bg-red-400" />
            Fanprojekt · in Entwicklung
          </span>
        }
        title={
          <>
            Willkommen im <span className="bg-linear-to-r from-red-300 to-orange-200 bg-clip-text text-transparent">PokéLabs</span>
          </>
        }
        description="Hier findest du umfangreiche Informationen zu allen Pokémon, Attacken, Fähigkeiten, Items und Beeren. Die Seite ist ein reines Fanprojekt von mir und befindet sich noch in der Entwicklung."
      >
        <div className="mt-8">
          <p className="text-xs font-semibold tracking-widest text-white/60 uppercase">Demnächst geplant</p>

          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {plannedFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <li key={feature.title} className={`${glassPanel} flex items-center gap-3 p-3`}>
                  <div className={`${glassIconBox} p-2`}>
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-white">{feature.title}</p>
                    {feature.description && <p className="truncate text-sm text-white/70">{feature.description}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </PageHeader>

      <div className="space-y-12 px-4 pb-10">
        {/* Statistik */}
        <section className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
          {cards.map(({ section, value }) => {
            const Icon = section.icon;

            return (
              <Link
                href={section.href}
                key={section.href}
                style={accentStyle(section.accent, section.accent2)}
                className={`${glassCard} flex flex-col gap-3 p-3 hover:-translate-y-1`}
              >
                <GlassBlobs />

                {/* Icon als Wasserzeichen */}
                <Icon
                  aria-hidden
                  strokeWidth={1.25}
                  className="pointer-events-none absolute -top-4 -right-4 -z-10 size-28 text-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 md:size-32"
                />

                <div className="flex items-center justify-between gap-2 px-1 pt-1">
                  <div className={`${glassIconBox} p-2 md:p-3`}>
                    <Icon className="size-6 md:size-7" />
                  </div>

                  <ArrowRight size={18} className="text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>

                <div className={`${glassPanel} p-3 md:p-4`}>
                  <strong className="block text-2xl text-white md:text-4xl">{value.toLocaleString("de-DE")}</strong>

                  <p className="mt-1 text-sm text-white/70">{section.name}</p>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Pokemon */}
        <section>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-1.5 rounded-full bg-[linear-gradient(to_bottom,var(--accent),var(--accent-2))]" />

              <div>
                <h2 className="pb-1 text-[20px] font-bold text-white md:text-3xl">Pokémon Datenbank</h2>

                <p className="text-[16px] text-slate-400 md:text-lg">Zufällige Einträge aus dem Pokédex</p>
              </div>
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
                bg-white/5
                px-4
                py-2
                text-sm
                font-semibold
                text-white/80
                backdrop-blur-md
                transition
                hover:border-white/20
                hover:bg-white/10
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
    </SectionTheme>
  );
}
