/*
  Warnings:

  - You are about to drop the column `reviewed_at` on the `Records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "answerAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "intervalDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Records" DROP COLUMN "reviewed_at";

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Decks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
