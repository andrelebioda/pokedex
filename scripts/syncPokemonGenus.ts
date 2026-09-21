import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen: ${url}`);
  }

  return response.json();
}

async function syncGenus(pokemonId: number) {
  const species = await fetchJson(`${API}/pokemon-species/${pokemonId}`);

  for (const language of ["de", "en"]) {
    const genus = species.genera.find((entry: any) => entry.language.name === language)?.genus ?? null;

    if (!genus) continue;

    await prisma.pokemonTranslation.upsert({
      where: {
        pokemonId_language: {
          pokemonId,
          language,
        },
      },

      update: {
        genus,
      },

      create: {
        pokemonId,
        language,
        name: species.name,
        genus,
      },
    });
  }

  console.log(`✅ Genus ${pokemonId} - ${species.name}`);
}

async function main() {
  const pokemonList = await prisma.pokemon.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  for (const pokemon of pokemonList) {
    try {
      await syncGenus(pokemon.id);
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
