import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";
import { mapPokemon } from "@/server/pokemon/pokemon.mapper";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id: Number(id),
    },

    select: {
      id: true,
      apiName: true,
      height: true,
      weight: true,
      sprite: true,

      translations: {
        where: {
          language: "de",
        },

        select: {
          name: true,
          description: true,
        },
      },

      stats: true,

      types: {
        select: {
          type: {
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
          },
        },
      },
    },
  });

  if (!pokemon) {
    return NextResponse.json(
      {
        error: "Pokemon nicht gefunden",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(mapPokemon(pokemon));
}
