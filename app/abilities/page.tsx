// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";

// Infinite-Scroll-Grid der Fähigkeiten-Karten
import AbilityExplorer from "@/components/ability/AbilityExplorer";
// Filter-Leiste (Sichtbarkeits-Modal, Sortierung, Suche)
import AbilityFilters from "@/components/ability/AbilityFilters";
// Vollbreiter Gradient-Header mit Icon der aktuellen Sektion
import PageHeader from "@/components/layout/PageHeader";
// setzt --accent/--accent-2 (Farbverlauf) für diese Seite und ihre Portale (Filter-Modal, Dropdowns)
import SectionTheme from "@/components/layout/SectionTheme";
// Sticky Filterleiste unter dem Header
import StickyBar from "@/components/layout/StickyBar";
// Ausgelagerte Seitengröße, Sortier-/Sichtbarkeits-Whitelist und Props-Typ dieser Seite
import { AbilitiesPageProps, LIMIT, VALID_HIDDEN, VALID_SORTS } from "@/app/abilities/page.constants";
// Name/Icon/Farben dieser Sektion für Header und Theme
import { sections } from "@/config/sections";
// Lädt die erste Seite Fähigkeiten serverseitig (für AbilityExplorer als initialAbilities)
import { getAbilityList, AbilityHiddenFilter, AbilitySort } from "@/server/ability/ability.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fähigkeiten",
  description: "Alle Fähigkeiten im Überblick inklusive der Pokémon, die sie besitzen können.",
  alternates: { canonical: "/abilities" },
};

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
