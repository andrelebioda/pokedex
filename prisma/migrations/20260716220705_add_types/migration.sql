-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeTranslation" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "pokemonId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("pokemonId","typeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Type_apiName_key" ON "Type"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "TypeTranslation_typeId_language_key" ON "TypeTranslation"("typeId", "language");

-- AddForeignKey
ALTER TABLE "TypeTranslation" ADD CONSTRAINT "TypeTranslation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
