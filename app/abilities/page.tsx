import type { Metadata } from "next";

import AbilityGrid from "@/components/ability/AbilityGrid";
import AbilitySearch from "@/components/ability/AbilitySearch";
import StickyBar from "@/components/layout/StickyBar";
import { getAbilityList } from "@/server/ability/ability.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fähigkeiten",
  description: "Alle Fähigkeiten im Überblick inklusive der Pokémon, die sie besitzen können.",
};

interface AbilitiesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AbilitiesPage({ searchParams }: AbilitiesPageProps) {
  const { search = "" } = await searchParams;

  const abilities = await getAbilityList({ search });

  return (
    <div>
      <StickyBar className="-mt-8 mb-8">
        <AbilitySearch search={search} />
      </StickyBar>

      <section>
        <AbilityGrid abilities={abilities} />
      </section>
    </div>
  );
}
