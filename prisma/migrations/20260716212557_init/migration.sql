-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "sprite" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonTranslation" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "genus" TEXT,

    CONSTRAINT "PokemonTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_apiName_key" ON "Pokemon"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonTranslation_pokemonId_language_key" ON "PokemonTranslation"("pokemonId", "language");

-- AddForeignKey
ALTER TABLE "PokemonTranslation" ADD CONSTRAINT "PokemonTranslation_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
