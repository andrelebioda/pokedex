import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(url);
  }

  return response.json();
}

async function syncPokemonTypes(id: number) {
  const pokemon = await fetchJson(`${API}/pokemon/${id}`);

  // vorhandene Verknüpfungen löschen
  await prisma.pokemonType.deleteMany({
    where: {
      pokemonId: id,
    },
  });

  for (const typeData of pokemon.types) {
    const typeId = typeData.type.url.split("/").filter(Boolean).pop();

    await prisma.pokemonType.create({
      data: {
        pokemonId: id,
        typeId: Number(typeId),
      },
    });

    console.log(`✅ ${pokemon.name} -> Type ${typeId}`);
  }
}

async function main() {
  const pokemon = await prisma.pokemon.findMany({
    select: {
      id: true,
    },
  });

  for (const p of pokemon) {
    try {
      await syncPokemonTypes(p.id);
    } catch (error) {
      console.error(`Fehler bei Pokemon ${p.id}`, error);
    }
  }
}

main().finally(() => prisma.$disconnect());
