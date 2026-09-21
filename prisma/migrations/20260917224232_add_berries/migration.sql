-- CreateTable
CREATE TABLE "Berry" (
    "id" INTEGER NOT NULL,
    "apiName" TEXT NOT NULL,
    "itemId" INTEGER,
    "growthTime" INTEGER,
    "maxHarvest" INTEGER,
    "naturalGiftPower" INTEGER,
    "naturalGiftType" TEXT,
    "size" INTEGER,
    "smoothness" INTEGER,
    "soilDryness" INTEGER,
    "firmness" TEXT,

    CONSTRAINT "Berry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BerryFlavor" (
    "id" SERIAL NOT NULL,
    "berryId" INTEGER NOT NULL,
    "flavor" TEXT NOT NULL,
    "potency" INTEGER NOT NULL,

    CONSTRAINT "BerryFlavor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Berry_apiName_key" ON "Berry"("apiName");

-- CreateIndex
CREATE UNIQUE INDEX "Berry_itemId_key" ON "Berry"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "BerryFlavor_berryId_flavor_key" ON "BerryFlavor"("berryId", "flavor");

-- AddForeignKey
ALTER TABLE "Berry" ADD CONSTRAINT "Berry_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BerryFlavor" ADD CONSTRAINT "BerryFlavor_berryId_fkey" FOREIGN KEY ("berryId") REFERENCES "Berry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
