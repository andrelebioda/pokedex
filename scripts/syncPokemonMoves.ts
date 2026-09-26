import { prisma } from "@/server/db/prisma";
import { fetchJson, POKEAPI_BASE, runForEachPokemon } from "@/scripts/lib/pokeapi";

interface PokeApiPokemon {
  name: string;
  moves: {
    move: { name: string };
    version_group_details: { move_learn_method?: { name: string }; level_learned_at?: number }[];
  }[];
}

async function syncPokemonMoves(pokemonId: number) {
  const pokemon = await fetchJson<PokeApiPokemon>(`${POKEAPI_BASE}/pokemon/${pokemonId}`);

  for (const moveEntry of pokemon.moves) {
    const moveName = moveEntry.move.name;

    const move = await prisma.move.findUnique({ where: { apiName: moveName } });

    if (!move) {
      console.warn(`⚠️ Move nicht gefunden: ${moveName}`);
      continue;
    }

    const detail = moveEntry.version_group_details[0];

    const data = {
      learnMethod: detail?.move_learn_method?.name ?? null,
      level: detail?.level_learned_at ?? null,
    };

    await prisma.pokemonMove.upsert({
      where: { pokemonId_moveId: { pokemonId, moveId: move.id } },
      update: data,
      create: { pokemonId, moveId: move.id, ...data },
    });
  }

  console.log(`✅ Moves synced ${pokemon.name}`);
}

runForEachPokemon(syncPokemonMoves)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
