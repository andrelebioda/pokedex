import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(url);
  }

  return response.json();
}

async function syncStats(id: number) {
  const pokemon = await fetchJson(`${API}/pokemon/${id}`);

  const stats = pokemon.stats;

  const values: any = {};

  for (const stat of stats) {
    switch (stat.stat.name) {
      case "hp":
        values.hp = stat.base_stat;
        break;

      case "attack":
        values.attack = stat.base_stat;
        break;

      case "defense":
        values.defense = stat.base_stat;
        break;

      case "special-attack":
        values.specialAttack = stat.base_stat;
        break;

      case "special-defense":
        values.specialDefense = stat.base_stat;
        break;

      case "speed":
        values.speed = stat.base_stat;
        break;
    }
  }

  await prisma.pokemonStats.upsert({
    where: {
      pokemonId: id,
    },

    update: values,

    create: {
      pokemonId: id,
      ...values,
    },
  });

  console.log(`✅ Stats synced ${pokemon.name}`);
}

async function main() {
  const pokemon = await prisma.pokemon.findMany({
    select: {
      id: true,
    },
  });

  for (const p of pokemon) {
    try {
      await syncStats(p.id);
    } catch (error) {
      console.error(`❌ Fehler bei ${p.id}`, error);
    }
  }
}

main().finally(() => prisma.$disconnect());
