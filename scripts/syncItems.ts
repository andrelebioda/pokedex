import { prisma } from "@/server/db/prisma";
import { findByLanguage, fetchJson, POKEAPI_BASE, runForEachListEntry } from "@/scripts/lib/pokeapi";

interface PokeApiItem {
  id: number;
  name: string;
  fling_power: number | null;
  fling_effect?: { name: string };
  category?: { name: string };
  sprites?: { default: string | null };
  effect_entries: { language: { name: string }; effect: string }[];
  names: { language: { name: string }; name: string }[];
  flavor_text_entries: { language: { name: string }; text: string }[];
  // PokeAPI hat das flache `cost`-Feld entfernt; Preise stecken jetzt pro Version-Group in `prices`.
  prices: { purchase_price: number | null; sell_price: number | null }[];
}

async function syncItem(id: number) {
  const item = await fetchJson<PokeApiItem>(`${POKEAPI_BASE}/item/${id}`);

  const effectEntry = findByLanguage(item.effect_entries, "en");
  const priceEntry = item.prices.find((price) => price.purchase_price != null) ?? item.prices[0];
  const cost = priceEntry?.purchase_price ?? priceEntry?.sell_price ?? null;

  const data = {
    apiName: item.name,
    cost,
    flingPower: item.fling_power,
    flingEffect: item.fling_effect?.name ?? null,
    category: item.category?.name,
    effect: effectEntry?.effect ?? null,
    sprite: item.sprites?.default ?? null,
  };

  const syncedItem = await prisma.item.upsert({
    where: { id: item.id },
    update: data,
    create: { id: item.id, ...data },
  });

  for (const translation of item.names) {
    const language = translation.language.name;
    const descriptionEntry = findByLanguage(item.flavor_text_entries, language);

    await prisma.itemTranslation.upsert({
      where: { itemId_language: { itemId: syncedItem.id, language } },
      update: { name: translation.name, description: descriptionEntry?.text ?? null },
      create: { itemId: syncedItem.id, language, name: translation.name, description: descriptionEntry?.text ?? null },
    });
  }

  console.log(`✅ ${item.id} - ${item.name}`);
}

runForEachListEntry("item", syncItem)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
