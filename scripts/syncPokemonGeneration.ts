import { prisma } from "@/server/db/prisma";
import { fetchJson, idFromUrl, POKEAPI_BASE, runForEachPokemon } from "@/scripts/lib/pokeapi";

interface PokeApiSpecies {
  name: string;
  generation?: { url: string };
}

async function syncGeneration(pokemonId: number) {
  const species = await fetchJson<PokeApiSpecies>(`${POKEAPI_BASE}/pokemon-species/${pokemonId}`);

  const generation = species.generation ? idFromUrl(species.generation.url) : 0;

  if (!generation) {
    console.warn(`⚠️ Keine Generation gefunden: ${pokemonId}`);
    return;
  }

  await prisma.pokemon.update({ where: { id: pokemonId }, data: { generation } });

  console.log(`✅ Generation ${pokemonId} - ${species.name} - Gen ${generation}`);
}

runForEachPokemon(syncGeneration)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
