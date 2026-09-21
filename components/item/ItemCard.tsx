import ItemImage from "@/components/item/ItemImage";
import { MappedItem } from "@/server/item/item.service";

interface ItemCardProps {
  item: MappedItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-4
        transition
        hover:border-slate-700
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-800/50
        "
      >
        <ItemImage src={item.image} alt={item.name} />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold text-white text-md">{item.name}</h3>

        {item.effect && <p className="mt-1 text-[14px] text-slate-400">{item.effect}</p>}
      </div>
    </div>
  );
}
