-- CreateTable
CREATE TABLE "item" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "cost" INTEGER,
    "flingPower" INTEGER,
    "flingEffect" TEXT,
    "category" TEXT,
    "effect" TEXT,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTranslation" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ItemTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_apiName_key" ON "item"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "ItemTranslation_itemId_language_key" ON "ItemTranslation"("itemId", "language");

-- AddForeignKey
ALTER TABLE "ItemTranslation" ADD CONSTRAINT "ItemTranslation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
