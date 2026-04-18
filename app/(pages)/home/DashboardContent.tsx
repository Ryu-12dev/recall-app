import type { Deck } from "@/lib/type";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import DeckActionButtons from "./_components/DeckActionButtons";
import { getCardNumber } from "./action";
import { cacheTag } from "next/cache";

export async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DecksCache userId={user!.id} />;

}

export async function DecksCache({ userId }: { userId: string }) {
  "use cache"
  cacheTag(`decks-${userId}`);
  const decks: Deck[] = await prisma.decks.findMany({
    where: {
      userId,
    },
  });
  console.log("デッキを取得しました");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="group bg-white py-4 px-8 rounded-2xl shadow-md border border-white border-4
          hover:-translate-y-1 hover:shadow-xl hover:shadow-xl hover:cursor-pointer
          transition duration-300 ease-out"
        >
          <header className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xl truncate flex-1 min-w-0 font-semibold">
              {deck.name}
            </p>
            <DeckActionButtons id={deck.id} />
          </header>
          <hr className="text-gray-400 mb-3" />
          <footer className="flex gap-4">
            <p>今日のカード: 
              <span className="text-blue-500 font-semibold">{getCardNumber(deck.id)}</span>
            </p>
          </footer>
        </div>
      ))}
    </div>
  );
}
