import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncAbility(id: number) {
  const ability = await fetchJson(`${API}/ability/${id}`);

  const effectEntry = ability.effect_entries.find((entry: any) => entry.language.name === "en");

  const syncedAbility = await prisma.ability.upsert({
    where: {
      id: ability.id,
    },

    update: {
      apiName: ability.name,

      effect: effectEntry?.effect ?? null,
    },

    create: {
      id: ability.id,

      apiName: ability.name,

      effect: effectEntry?.effect ?? null,
    },
  });

  for (const translation of ability.names) {
    const language = translation.language.name;

    const descriptionEntry = ability.flavor_text_entries.find((entry: any) => entry.language.name === language);

    await prisma.abilityTranslation.upsert({
      where: {
        abilityId_language: {
          abilityId: syncedAbility.id,

          language,
        },
      },

      update: {
        name: translation.name,

        description: descriptionEntry?.flavor_text ?? null,
      },

      create: {
        abilityId: syncedAbility.id,

        language,

        name: translation.name,

        description: descriptionEntry?.flavor_text ?? null,
      },
    });
  }

  for (const entry of ability.pokemon) {
    const pokemon = await prisma.pokemon.findUnique({
      where: {
        apiName: entry.pokemon.name,
      },
    });

    if (!pokemon) {
      console.warn(`⚠️ Pokémon nicht gefunden: ${entry.pokemon.name}`);

      continue;
    }

    await prisma.pokemonAbility.upsert({
      where: {
        pokemonId_abilityId: {
          pokemonId: pokemon.id,

          abilityId: syncedAbility.id,
        },
      },

      update: {
        isHidden: entry.is_hidden,

        slot: entry.slot,
      },

      create: {
        pokemonId: pokemon.id,

        abilityId: syncedAbility.id,

        isHidden: entry.is_hidden,

        slot: entry.slot,
      },
    });
  }

  console.log(`✅ ${ability.id} - ${ability.name}`);
}

async function main() {
  const list = await fetchJson(`${API}/ability?limit=10000`);

  for (const entry of list.results) {
    try {
      const id = Number(entry.url.split("/").filter(Boolean).pop());

      await syncAbility(id);
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
