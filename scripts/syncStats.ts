import { prisma } from "@/server/db/prisma";
import { fetchJson, POKEAPI_BASE, runForEachPokemon } from "@/scripts/lib/pokeapi";

interface PokeApiPokemon {
  name: string;
  stats: { stat: { name: string }; base_stat: number }[];
}

interface StatValues {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

const STAT_KEY_BY_API_NAME: Record<string, keyof StatValues> = {
  hp: "hp",
  attack: "attack",
  defense: "defense",
  "special-attack": "specialAttack",
  "special-defense": "specialDefense",
  speed: "speed",
};

async function syncStats(id: number) {
  const pokemon = await fetchJson<PokeApiPokemon>(`${POKEAPI_BASE}/pokemon/${id}`);

  const values: StatValues = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 };

  for (const stat of pokemon.stats) {
    const key = STAT_KEY_BY_API_NAME[stat.stat.name];
    if (key) values[key] = stat.base_stat;
  }

  await prisma.pokemonStats.upsert({
    where: { pokemonId: id },
    update: values,
    create: { pokemonId: id, ...values },
  });

  console.log(`✅ Stats synced ${pokemon.name}`);
}

runForEachPokemon(syncStats)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
