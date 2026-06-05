-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('BASIC', 'CLOZE');

-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "cardType" "CardType" NOT NULL DEFAULT 'BASIC';
