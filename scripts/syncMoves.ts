import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncMove(id: number) {
  const move = await fetchJson(`${API}/move/${id}`);

  const type = await prisma.type.findUnique({
    where: {
      apiName: move.type.name,
    },
  });

  if (!type) {
    console.warn(`⚠️ Typ nicht gefunden: ${move.type.name}`);
    return;
  }

  const effectEntry = move.effect_entries.find((entry: any) => entry.language.name === "en");

  const syncedMove = await prisma.move.upsert({
    where: {
      id: move.id,
    },

    update: {
      apiName: move.name,

      typeId: type.id,

      power: move.power,

      accuracy: move.accuracy,

      pp: move.pp,

      damageClass: move.damage_class?.name,

      priority: move.priority,

      effectChance: move.effect_chance,

      effect: effectEntry?.effect ?? null,
    },

    create: {
      id: move.id,

      apiName: move.name,

      typeId: type.id,

      power: move.power,

      accuracy: move.accuracy,

      pp: move.pp,

      damageClass: move.damage_class?.name,

      priority: move.priority,

      effectChance: move.effect_chance,

      effect: effectEntry?.effect ?? null,
    },
  });

  const translations = move.names;

  for (const translation of translations) {
    const language = translation.language.name;

    const descriptionEntry = move.flavor_text_entries.find((entry: any) => entry.language.name === language);

    await prisma.moveTranslation.upsert({
      where: {
        moveId_language: {
          moveId: syncedMove.id,

          language,
        },
      },

      update: {
        name: translation.name,

        description: descriptionEntry?.flavor_text ?? null,
      },

      create: {
        moveId: syncedMove.id,

        language,

        name: translation.name,

        description: descriptionEntry?.flavor_text ?? null,
      },
    });
  }

  console.log(`✅ ${move.id} - ${move.name}`);
}

async function main() {
  const list = await fetchJson(`${API}/move?limit=10000`);

  for (const entry of list.results) {
    try {
      const id = Number(entry.url.split("/").filter(Boolean).pop());

      await syncMove(id);
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
