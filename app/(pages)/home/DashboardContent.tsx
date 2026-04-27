import type { Deck } from "@/lib/type";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import DeckActionButtons from "./_components/DeckActionButtons";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

type DeckWithCardCount = Deck & {
  todayCardCount: number;
};

export async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const decks = await getDecks(user?.id);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="group bg-white py-4 px-8 rounded-2xl shadow-md border border-white border-4
          hover:-translate-y-1 hover:shadow-xl hover:shadow-xl
          transition duration-300 ease-out"
        >
            <header className="flex items-center justify-between gap-2 mb-3">
              <Link href={`/review/${deck.id}`} prefetch={false} className="flex-1 min-w-0">
                <p className="text-xl truncate font-semibold hover:cursor-pointer hover:text-blue-500">
                  {deck.name}
                </p>
              </Link>
              <DeckActionButtons id={deck.id} />
            </header>
          <hr className="text-gray-400 mb-3" />
          <footer className="flex gap-4">
            <p>今日のカード: 
              <span className="text-blue-500 font-semibold">{deck.todayCardCount}</span>
            </p>
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

  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const endOfTodayUTC = new Date(now.getTime() + jstOffset);
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  endOfTodayUTC.setTime(endOfTodayUTC.getTime() - jstOffset);

  const [decks, cardCounts] = await Promise.all([
    prisma.decks.findMany({
      where: {
        userId,
      },
    }),
    prisma.cards.groupBy({
      by: ["deckId"],
      where: {
        deck: {
          userId,
        },
        answerAt: {
          lte: endOfTodayUTC,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const cardCountByDeckId = new Map(
    cardCounts.map((count) => [count.deckId, count._count._all])
  );

  return decks.map((deck): DeckWithCardCount => ({
    ...deck,
    todayCardCount: cardCountByDeckId.get(deck.id) ?? 0,
  }));
}
