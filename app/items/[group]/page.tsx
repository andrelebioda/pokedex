import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import ItemCategoryList from "@/components/item/ItemCategoryList";
import ItemFilters from "@/components/item/ItemFilters";
import { getItemCategoryGroupBySlug } from "@/config/itemCategories";
import { getGroupCategoryOptions, getItemsForGroup } from "@/server/item/item.service";

export const dynamic = "force-dynamic";

interface ItemGroupPageProps {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ search?: string; categories?: string }>;
}

export default async function ItemGroupPage({ params, searchParams }: ItemGroupPageProps) {
  const { group: groupSlug } = await params;
  const { search = "", categories: categoriesParam = "" } = await searchParams;

  const group = getItemCategoryGroupBySlug(groupSlug);
  if (!group) {
    notFound();
  }

  const selectedCategories = categoriesParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const itemGroups = await getItemsForGroup(groupSlug, { search, categories: selectedCategories });
  if (!itemGroups) {
    notFound();
  }

  const categoryOptions = getGroupCategoryOptions(groupSlug);

  return (
    <div>
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

        {group.flat && (
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
            {itemGroups.reduce((sum, itemGroup) => sum + itemGroup.items.length, 0)}
          </span>
        )}
      </div>

      <div
        className="
          sticky
          top-0
          z-10
          -mx-8
          mb-8
          border-b
          border-slate-800
          bg-slate-950/95
          px-8
          py-4
          backdrop-blur
        "
      >
        <ItemFilters categories={categoryOptions} search={search} selectedCategories={selectedCategories} />
      </div>

      <ItemCategoryList groups={itemGroups} hideHeader={group.flat} />
    </div>
  );
}
