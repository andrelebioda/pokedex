import { prisma } from "@/server/db/prisma";
import { fetchJson, idFromUrl, POKEAPI_BASE, runForEachPokemon } from "@/scripts/lib/pokeapi";

interface PokeApiPokemon {
  name: string;
  types: { slot: number; type: { url: string } }[];
}

async function syncPokemonTypes(id: number) {
  const pokemon = await fetchJson<PokeApiPokemon>(`${POKEAPI_BASE}/pokemon/${id}`);

  // vorhandene Verknüpfungen löschen
  await prisma.pokemonType.deleteMany({ where: { pokemonId: id } });

  for (const typeData of pokemon.types) {
    const typeId = idFromUrl(typeData.type.url);

    await prisma.pokemonType.create({
      data: { pokemonId: id, typeId, slot: typeData.slot },
    });

    console.log(`✅ ${pokemon.name} -> Type ${typeId}`);
  }
}

runForEachPokemon(syncPokemonTypes)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
