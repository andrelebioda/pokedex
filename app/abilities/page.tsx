import type { Metadata } from "next";

import AbilityFilters from "@/components/ability/AbilityFilters";
import AbilityGrid from "@/components/ability/AbilityGrid";
import StickyBar from "@/components/layout/StickyBar";
import { getAbilityList, AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fähigkeiten",
  description: "Alle Fähigkeiten im Überblick inklusive der Pokémon, die sie besitzen können.",
};

const VALID_SORTS: AbilitySort[] = ["name", "count"];
const VALID_HIDDEN: AbilityHiddenFilter[] = ["hidden", "visible"];

interface AbilitiesPageProps {
  searchParams: Promise<{ search?: string; hidden?: string; sort?: string }>;
}

export default async function AbilitiesPage({ searchParams }: AbilitiesPageProps) {
  const { search = "", hidden: hiddenParam = "", sort: sortParam } = await searchParams;

  const selectedHidden = hiddenParam
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is AbilityHiddenFilter => VALID_HIDDEN.includes(value as AbilityHiddenFilter));

  const sort = VALID_SORTS.includes(sortParam as AbilitySort) ? (sortParam as AbilitySort) : "name";

  const abilities = await getAbilityList({ search, hidden: selectedHidden, sort });

  return (
    <div>
      <StickyBar className="-mt-8 mb-8">
        <AbilityFilters search={search} selectedHidden={selectedHidden} sort={sort} />
      </StickyBar>

      <section>
        <AbilityGrid abilities={abilities} />
      </section>
    </div>
  );
}
