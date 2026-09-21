-- CreateTable
CREATE TABLE "PokemonStats" (
    "pokemonId" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,

    CONSTRAINT "PokemonStats_pkey" PRIMARY KEY ("pokemonId")
);

-- AddForeignKey
ALTER TABLE "PokemonStats" ADD CONSTRAINT "PokemonStats_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
