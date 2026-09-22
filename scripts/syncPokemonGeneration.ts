import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncGeneration(pokemonId: number) {
  const species = await fetchJson(`${API}/pokemon-species/${pokemonId}`);

  const generation = Number(species.generation?.url?.split("/").filter(Boolean).pop());

  if (!generation) {
    console.warn(`⚠️ Keine Generation gefunden: ${pokemonId}`);
    return;
  }

  await prisma.pokemon.update({
    where: { id: pokemonId },
    data: { generation },
  });

  console.log(`✅ Generation ${pokemonId} - ${species.name} - Gen ${generation}`);
}

async function main() {
  const pokemonList = await prisma.pokemon.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  for (const pokemon of pokemonList) {
    try {
      await syncGeneration(pokemon.id);
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
