-- CreateTable
CREATE TABLE "PokemonMove" (
    "pokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "learnMethod" TEXT,
    "level" INTEGER,

    CONSTRAINT "PokemonMove_pkey" PRIMARY KEY ("pokemonId","moveId")
);

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
