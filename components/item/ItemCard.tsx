import ItemImage from "@/components/item/ItemImage";
import { glassCard, glassIconBox, glassPanel } from "@/components/layout/cardStyles";
import GlassBlobs from "@/components/layout/GlassBlobs";
import { MappedItem } from "@/server/item/item.service";

interface ItemCardProps {
  item: MappedItem;
}

// Die Farben kommen aus der SectionTheme der Item-Gruppe.
export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className={`${glassCard} flex items-stretch gap-3 rounded-2xl p-2.5`}>
      <GlassBlobs />

      <div className={`${glassIconBox} flex size-14 shrink-0 items-center justify-center self-center`}>
        <ItemImage src={item.image} alt={item.name} />
      </div>

      <div className={`${glassPanel} min-w-0 flex-1 rounded-xl px-3 py-2`}>
        <h3 className="text-md font-semibold text-white">{item.name}</h3>

        {item.effect && <p className="mt-0.5 text-[14px] text-white/80 md:text-[15px]">{item.effect}</p>}
      </div>
    </div>
  );
}
