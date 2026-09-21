-- CreateTable
CREATE TABLE "Move" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "power" INTEGER,
    "accuracy" INTEGER,
    "pp" INTEGER,
    "damageClass" TEXT,
    "priority" INTEGER,
    "effectChance" INTEGER,
    "effect" TEXT,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoveTranslation" (
    "id" SERIAL NOT NULL,
    "moveId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MoveTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Move_apiName_key" ON "Move"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "MoveTranslation_moveId_language_key" ON "MoveTranslation"("moveId", "language");

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveTranslation" ADD CONSTRAINT "MoveTranslation_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
