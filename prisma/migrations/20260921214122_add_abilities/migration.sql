-- CreateTable
CREATE TABLE "Ability" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "effect" TEXT,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbilityTranslation" (
    "id" SERIAL NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AbilityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "slot" INTEGER,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","abilityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ability_apiName_key" ON "Ability"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "AbilityTranslation_abilityId_language_key" ON "AbilityTranslation"("abilityId", "language");

-- AddForeignKey
ALTER TABLE "AbilityTranslation" ADD CONSTRAINT "AbilityTranslation_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
