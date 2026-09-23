import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ItemExplorer from "@/components/item/ItemExplorer";
import ItemFilters from "@/components/item/ItemFilters";
import StickyBar from "@/components/layout/StickyBar";
import { getItemCategoryGroupBySlug } from "@/config/itemCategories";
import { getGroupCategoryOptions, getItemsForGroup, ItemSort } from "@/server/item/item.service";

export const dynamic = "force-dynamic";

const LIMIT = 60;
const VALID_SORTS: ItemSort[] = ["name-asc", "name-desc"];

interface ItemGroupPageProps {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ search?: string; categories?: string; sort?: string }>;
}

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

  return (
    <div>
      <div className="px-4 pt-6">
        <Link
          href="/items"
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-sm
            text-slate-400
            transition
            hover:text-white
          "
        >
          <ArrowLeft size={16} />
          Zurück zu allen Kategorien
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{group.name}</h1>

          {group.flat && <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">{total}</span>}
        </div>
      </div>

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
    </div>
  );
}
