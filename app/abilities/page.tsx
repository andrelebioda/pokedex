import type { Metadata } from "next";

import AbilityExplorer from "@/components/ability/AbilityExplorer";
import AbilityFilters from "@/components/ability/AbilityFilters";
import PageHeader from "@/components/layout/PageHeader";
import SectionTheme from "@/components/layout/SectionTheme";
import StickyBar from "@/components/layout/StickyBar";
import { sections } from "@/config/sections";
import { getAbilityList, AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fähigkeiten",
  description: "Alle Fähigkeiten im Überblick inklusive der Pokémon, die sie besitzen können.",
  alternates: { canonical: "/abilities" },
};

const LIMIT = 50;
const VALID_SORTS: AbilitySort[] = ["name-asc", "name-desc", "count-asc", "count-desc"];
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

  const sort = VALID_SORTS.includes(sortParam as AbilitySort) ? (sortParam as AbilitySort) : "name-asc";

  const { abilities, hasMore } = await getAbilityList(1, LIMIT, { search, hidden: selectedHidden, sort });

  return (
    <SectionTheme accent={sections.abilities.accent} accent2={sections.abilities.accent2}>
      <PageHeader section={sections.abilities} />

      <StickyBar>
        <AbilityFilters search={search} selectedHidden={selectedHidden} sort={sort} />
      </StickyBar>

      <section>
        <AbilityExplorer initialAbilities={abilities} initialHasMore={hasMore} search={search} hidden={selectedHidden} sort={sort} />
      </section>
    </SectionTheme>
  );
}
