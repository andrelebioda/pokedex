import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

const MAX_POKEMON = 1025;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url: string, retries = 3) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`⚠️ Fehler bei Request. Neuer Versuch (${retries})`);

      await sleep(2000);

      return fetchJson(url, retries - 1);
    }

    throw error;
  }
}

function getGermanName(species: any) {
  return species.names.find((n: any) => n.language.name === "de")?.name ?? species.name;
}

function getGermanDescription(species: any) {
  return (
    species.flavor_text_entries
      .find((f: any) => f.language.name === "de")
      ?.flavor_text?.replace(/\n/g, " ")
      ?.replace(/\f/g, " ") ?? ""
  );
}

async function syncPokemon(id: number) {
  console.log(`🔄 Sync Pokemon ${id}`);

  const pokemon = await fetchJson(`${API}/pokemon/${id}`);

  const species = await fetchJson(pokemon.species.url);

  const name = getGermanName(species);

  const description = getGermanDescription(species);

  await prisma.pokemon.upsert({
    where: {
      id,
    },

    update: {
      apiName: pokemon.name,

      height: pokemon.height,

      weight: pokemon.weight,

      sprite: pokemon.sprites.other["official-artwork"].front_default,
    },

    create: {
      id,

      apiName: pokemon.name,

      height: pokemon.height,

      weight: pokemon.weight,

      sprite: pokemon.sprites.other["official-artwork"].front_default,
    },
  });

  await prisma.pokemonTranslation.upsert({
    where: {
      pokemonId_language: {
        pokemonId: id,
        language: "de",
      },
    },

    update: {
      name,

      description,
    },

    create: {
      pokemonId: id,

      language: "de",

      name,

      description,
    },
  });

  console.log(`✅ ${id} - ${name}`);
}

async function getStartId() {
  const last = await prisma.pokemon.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  return last?.id ?? 0;
}

async function main() {
  const start = await getStartId();

  console.log(`🚀 Starte bei Pokemon ${start + 1}`);

  for (let i = start + 1; i <= MAX_POKEMON; i++) {
    try {
      await syncPokemon(i);
    } catch (error) {
      console.error(`❌ Fehler bei Pokemon ${i}`, error);
    }

    // kleine Pause gegen Rate Limits

    await sleep(200);

    // längere Pause alle 50

    if (i % 50 === 0) {
      console.log("⏸ Pause...");

      await sleep(3000);
    }
  }

  console.log("🎉 Sync abgeschlossen");
}

main()
  .catch(console.error)

  .finally(async () => {
    await prisma.$disconnect();
  });
