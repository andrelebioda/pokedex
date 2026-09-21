import { prisma } from "@/server/db/prisma";

export async function getAllTypes() {
  const types = await prisma.type.findMany({
    orderBy: {
      apiName: "asc",
    },

    select: {
      apiName: true,

      translations: {
        where: {
          language: "de",
        },
        select: {
          name: true,
        },
      },
    },
  });

  return types.map((type) => ({
    slug: type.apiName,
    name: type.translations[0]?.name ?? type.apiName,
  }));
}
