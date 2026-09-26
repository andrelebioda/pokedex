// Next.js: Typ für die Seiten-<head>-Metadaten
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Infinite-Scroll-Grid der Items dieser Kategorie-Gruppe (gruppiert nach Kategorie)
import ItemExplorer from "@/components/item/ItemExplorer";
// Filter-Leiste (Kategorien-Modal, Sortierung, Suche)
import ItemFilters from "@/components/item/ItemFilters";
// Vollbreiter Gradient-Header mit Icon der aktuellen Sektion
import PageHeader from "@/components/layout/PageHeader";
// setzt --accent/--accent-2 (Farbverlauf) für diese Seite und ihre Portale (Filter-Modal, Dropdowns)
import SectionTheme from "@/components/layout/SectionTheme";
// Sticky Filterleiste unter dem Header
import StickyBar from "@/components/layout/StickyBar";
// Ausgelagerte Seitengröße, Sortier-Whitelist und Props-Typ dieser Seite
import { ItemGroupPageProps, LIMIT, VALID_SORTS } from "@/app/items/[group]/page.constants";
// Gruppen-Definition (welche Kategorien gehören zusammen) + Icon/Akzentfarbe je Gruppe
import { getItemCategoryGroupBySlug, getItemGroupStyle } from "@/config/itemCategories";
// Name/Icon/Farben der übergeordneten "Items"-Sektion für den Header
import { sections } from "@/config/sections";
// Lädt Kategorie-Optionen für den Filter sowie die erste Seite Items serverseitig
import { getGroupCategoryOptions, getItemsForGroup, ItemSort } from "@/server/item/item.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ItemGroupPageProps): Promise<Metadata> {
  const { group: groupSlug } = await params;

  const group = getItemCategoryGroupBySlug(groupSlug);
  if (!group) {
    return { title: "Kategorie nicht gefunden" };
  }

  return {
    title: `${group.name} – Items`,
    description: `Alle Items der Kategorie ${group.name} im Überblick.`,
    alternates: { canonical: `/items/${groupSlug}` },
  };
}

export default async function ItemGroupPage({ params, searchParams }: ItemGroupPageProps) {
  const { group: groupSlug } = await params;
  const { search = "", categories: categoriesParam = "", sort: sortParam } = await searchParams;

  const group = getItemCategoryGroupBySlug(groupSlug);
  if (!group) {
    notFound();
  }

  const selectedCategories = categoriesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const sort = VALID_SORTS.includes(sortParam as ItemSort) ? (sortParam as ItemSort) : "name-asc";

  const result = await getItemsForGroup(groupSlug, 1, LIMIT, { search, categories: selectedCategories, sort });
  if (!result) {
    notFound();
  }

  const { items: initialItems, hasMore: initialHasMore, total } = result;

  const categoryOptions = getGroupCategoryOptions(groupSlug);
  const groupStyle = getItemGroupStyle(groupSlug);

  return (
    <SectionTheme accent={groupStyle.accent} accent2={groupStyle.accent2}>
      <PageHeader
        section={sections.items}
        title={group.name}
        description={`${categoryOptions.length === 1 ? "1 Kategorie" : `${categoryOptions.length} Kategorien`} in dieser Gruppe`}
        icon={groupStyle.icon}
        count={total}
        backLink={{ href: "/items", label: "Zurück zu allen Kategorien" }}
      />

      <StickyBar>
        <ItemFilters categories={categoryOptions} search={search} selectedCategories={selectedCategories} sort={sort} />
      </StickyBar>

      <ItemExplorer
        groupSlug={groupSlug}
        initialItems={initialItems}
        initialHasMore={initialHasMore}
        hideHeader={group.flat}
        search={search}
        categories={selectedCategories}
        sort={sort}
      />
    </SectionTheme>
  );
}
