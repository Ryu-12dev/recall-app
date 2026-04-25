-- CreateTable
CREATE TABLE "Decks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "answerAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Records" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
