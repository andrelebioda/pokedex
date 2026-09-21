import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncItem(id: number) {
  const item = await fetchJson(`${API}/item/${id}`);

  const effectEntry = item.effect_entries.find((entry: any) => entry.language.name === "en");

  // PokeAPI hat das flache `cost`-Feld entfernt; Preise stecken jetzt pro Version-Group in `prices`.
  const priceEntry = item.prices.find((price: any) => price.purchase_price != null) ?? item.prices[0];

  const cost = priceEntry?.purchase_price ?? priceEntry?.sell_price ?? null;

  const syncedItem = await prisma.item.upsert({
    where: {
      id: item.id,
    },

    update: {
      apiName: item.name,

      cost,

      flingPower: item.fling_power,

      flingEffect: item.fling_effect?.name ?? null,

      category: item.category?.name,

      effect: effectEntry?.effect ?? null,

      sprite: item.sprites?.default ?? null,
    },

    create: {
      id: item.id,

      apiName: item.name,

      cost,

      flingPower: item.fling_power,

      flingEffect: item.fling_effect?.name ?? null,

      category: item.category?.name,

      effect: effectEntry?.effect ?? null,

      sprite: item.sprites?.default ?? null,
    },
  });

  const translations = item.names;

  for (const translation of translations) {
    const language = translation.language.name;

    const descriptionEntry = item.flavor_text_entries.find((entry: any) => entry.language.name === language);

    await prisma.itemTranslation.upsert({
      where: {
        itemId_language: {
          itemId: syncedItem.id,

          language,
        },
      },

      update: {
        name: translation.name,

        description: descriptionEntry?.text ?? null,
      },

      create: {
        itemId: syncedItem.id,

        language,

        name: translation.name,

        description: descriptionEntry?.text ?? null,
      },
    });
  }

  console.log(`✅ ${item.id} - ${item.name}`);
}

async function main() {
  const list = await fetchJson(`${API}/item?limit=10000`);

  for (const entry of list.results) {
    try {
      const id = Number(entry.url.split("/").filter(Boolean).pop());

      await syncItem(id);
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
