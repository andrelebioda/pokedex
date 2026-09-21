import { prisma } from "@/server/db/prisma";

const API = "https://pokeapi.co/api/v2";

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(url);
  }

  return response.json();
}

async function syncTypes() {
  const data = await fetchJson(`${API}/type`);

  for (const type of data.results) {
    const detail = await fetchJson(type.url);

    const germanName = detail.names.find((n: any) => n.language.name === "de")?.name ?? detail.name;

    await prisma.type.upsert({
      where: {
        id: detail.id,
      },

      update: {
        apiName: detail.name,
      },

      create: {
        id: detail.id,
        apiName: detail.name,
      },
    });

    await prisma.typeTranslation.upsert({
      where: {
        typeId_language: {
          typeId: detail.id,
          language: "de",
        },
      },

      update: {
        name: germanName,
      },

      create: {
        typeId: detail.id,
        language: "de",
        name: germanName,
      },
    });

    console.log(`✅ ${germanName}`);
  }
}

syncTypes().finally(() => prisma.$disconnect());
