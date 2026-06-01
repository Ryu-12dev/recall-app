import { prisma } from "@/lib/prisma/prisma";
import { getAuthenticatedUserId } from "@/lib/supabase/server";
import DeckActionButtons from "./_components/DeckActionButtons";
import { cacheLife, cacheTag } from "next/cache";
import FooterButton from "./_components/FooterButton";
import ReviewDeckLink from "./_components/ReviewDeckLink";

export async function DashboardContent() {
  const userId = await getAuthenticatedUserId();
  const decks = await getDecks(userId ?? undefined);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="group bg-white py-4 px-6 rounded-2xl shadow-md border border-white border-4
          hover:-translate-y-1 hover:shadow-xl hover:shadow-xl
          transition duration-300 ease-out"
        >
          <header className="flex items-center justify-between gap-2 mb-3">
            <ReviewDeckLink id={deck.id} name={deck.name} />
            <DeckActionButtons id={deck.id} />
          </header>
          <hr className="text-gray-400 mb-3" />
          <footer className="flex justify-between gap-4">
            <p>今日のカード: 
              <span className="text-blue-500 font-semibold">{getCardNumber(userId, deck.id)}</span>
            </p>
            <div className="sm:hidden flex gap-6">
              <FooterButton id={deck.id} />
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
}

async function getDecks(userId: string | undefined) {
  "use cache";
  cacheTag(`decks-${userId}`);
  cacheLife("max");

  return await prisma.decks.findMany({
    where: {
      userId,
    },
  });
}

async function getCardNumber(userId: string | null, id: string) {
  "use cache";
  const jstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dateKey = jstNow.toISOString().slice(0, 10);
  cacheTag(`cards-${userId}-${dateKey}`);
  cacheTag(`cards-${userId}`);
  cacheLife("max");

  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const endOfTodayUTC = new Date(now.getTime() + jstOffset);
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  endOfTodayUTC.setTime(endOfTodayUTC.getTime() - jstOffset);

  return await prisma.cards.count({
    where: {
      deckId: id,
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
  });
}
