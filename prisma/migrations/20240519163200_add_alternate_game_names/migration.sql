-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "wikidataId" TEXT;

-- CreateTable
CREATE TABLE "AlternateGameName" (
    "gameId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AlternateGameName_pkey" PRIMARY KEY ("gameId","language")
);

-- AddForeignKey
ALTER TABLE "AlternateGameName" ADD CONSTRAINT "AlternateGameName_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
