-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "BGGRating" DROP NOT NULL,
ALTER COLUMN "BGGRating" DROP DEFAULT,
ALTER COLUMN "BGGRank" DROP NOT NULL,
ALTER COLUMN "BGGRank" DROP DEFAULT;
