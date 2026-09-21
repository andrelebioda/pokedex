import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncBerry(id: number) {
  const berry = await fetchJson(`${API}/berry/${id}`);

  const item = await prisma.item.findUnique({
    where: {
      apiName: berry.item.name,
    },
  });

  if (!item) {
    console.warn(`⚠️ Item nicht gefunden: ${berry.item.name}`);
    return;
  }

  const syncedBerry = await prisma.berry.upsert({
    where: {
      id: berry.id,
    },

    update: {
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
    },

    create: {
      id: berry.id,

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
    },
  });

  for (const entry of berry.flavors) {
    const flavor = entry.flavor.name;

    await prisma.berryFlavor.upsert({
      where: {
        berryId_flavor: {
          berryId: syncedBerry.id,

          flavor,
        },
      },

      update: {
        potency: entry.potency,
      },

      create: {
        berryId: syncedBerry.id,

        flavor,

        potency: entry.potency,
      },
    });
  }

  console.log(`✅ ${berry.id} - ${berry.name}`);
}

async function main() {
  const list = await fetchJson(`${API}/berry?limit=10000`);

  for (const entry of list.results) {
    try {
      const id = Number(entry.url.split("/").filter(Boolean).pop());

      await syncBerry(id);
    } catch (error) {
      console.error(`❌ Fehler bei ${entry.name}`, error);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
