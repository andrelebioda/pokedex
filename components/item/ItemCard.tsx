import ItemImage from "@/components/item/ItemImage";
import { accentCard } from "@/components/layout/cardStyles";
import { MappedItem } from "@/server/item/item.service";

interface ItemCardProps {
  item: MappedItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className={`${accentCard} flex items-start gap-4 rounded-2xl p-4`}>
      <div
        className="
          flex
          size-14
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%)]
          ring-1
          ring-white/5
        "
      >
        <ItemImage src={item.image} alt={item.name} />
      </div>

      <div className="min-w-0">
        <h3 className="text-md font-semibold text-white">{item.name}</h3>

        {item.effect && <p className="mt-1 text-[14px] text-slate-400 md:text-[15px]">{item.effect}</p>}
      </div>
    </div>
  );
}
