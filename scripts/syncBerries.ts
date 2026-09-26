import { prisma } from "@/server/db/prisma";
import { fetchJson, POKEAPI_BASE, runForEachListEntry } from "@/scripts/lib/pokeapi";

interface PokeApiBerry {
  id: number;
  name: string;
  item: { name: string };
  growth_time: number | null;
  max_harvest: number | null;
  natural_gift_power: number | null;
  natural_gift_type?: { name: string };
  size: number | null;
  smoothness: number | null;
  soil_dryness: number | null;
  firmness?: { name: string };
  flavors: { flavor: { name: string }; potency: number }[];
}

async function syncBerry(id: number) {
  const berry = await fetchJson<PokeApiBerry>(`${POKEAPI_BASE}/berry/${id}`);

  const item = await prisma.item.findUnique({ where: { apiName: berry.item.name } });

  if (!item) {
    console.warn(`⚠️ Item nicht gefunden: ${berry.item.name}`);
    return;
  }

  const data = {
    apiName: item.apiName,
    itemId: item.id,
    growthTime: berry.growth_time,
    maxHarvest: berry.max_harvest,
    naturalGiftPower: berry.natural_gift_power,
    naturalGiftType: berry.natural_gift_type?.name ?? null,
    size: berry.size,
    smoothness: berry.smoothness,
    soilDryness: berry.soil_dryness,
    firmness: berry.firmness?.name ?? null,
  };

  const syncedBerry = await prisma.berry.upsert({
    where: { id: berry.id },
    update: data,
    create: { id: berry.id, ...data },
  });

  for (const entry of berry.flavors) {
    const flavor = entry.flavor.name;

    await prisma.berryFlavor.upsert({
      where: { berryId_flavor: { berryId: syncedBerry.id, flavor } },
      update: { potency: entry.potency },
      create: { berryId: syncedBerry.id, flavor, potency: entry.potency },
    });
  }

  console.log(`✅ ${berry.id} - ${berry.name}`);
}

runForEachListEntry("berry", syncBerry)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
