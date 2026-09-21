import ItemCard from "@/components/item/ItemCard";
import { ItemCategoryGroup } from "@/server/item/item.service";

interface ItemCategoryListProps {
  groups: ItemCategoryGroup[];
  hideHeader?: boolean;
}

export default function ItemCategoryList({ groups, hideHeader = false }: ItemCategoryListProps) {
  if (groups.length === 0) {
    return <p className="text-center text-slate-500">Keine Items gefunden.</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.category}>
          {!hideHeader && (
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{group.categoryName}</h2>

              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                {group.items.length}
              </span>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
