import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncPokemonMoves(pokemonId: number) {
  const pokemon = await fetchJson(`${API}/pokemon/${pokemonId}`);

  for (const moveEntry of pokemon.moves) {
    const moveName = moveEntry.move.name;

    const move = await prisma.move.findUnique({
      where: {
        apiName: moveName,
      },
    });

    if (!move) {
      console.warn(`⚠️ Move nicht gefunden: ${moveName}`);

      continue;
    }

    const detail = moveEntry.version_group_details[0];

    await prisma.pokemonMove.upsert({
      where: {
        pokemonId_moveId: {
          pokemonId,

          moveId: move.id,
        },
      },

      update: {
        learnMethod: detail?.move_learn_method?.name ?? null,

        level: detail?.level_learned_at ?? null,
      },

      create: {
        pokemonId,

        moveId: move.id,

        learnMethod: detail?.move_learn_method?.name ?? null,

        level: detail?.level_learned_at ?? null,
      },
    });
  }

  console.log(`✅ Moves synced ${pokemon.name}`);
}

async function main() {
  const pokemonList = await prisma.pokemon.findMany({
    select: {
      id: true,
    },
  });

  for (const pokemon of pokemonList) {
    try {
      await syncPokemonMoves(pokemon.id);
    } catch (error) {
      console.error(`❌ Fehler bei Pokemon ${pokemon.id}`, error);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
