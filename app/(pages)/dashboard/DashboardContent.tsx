import type { Deck } from "@/lib/type";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import DeckActionButtons from "./_components/DeckActionButtons";

export default async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const decks: Deck[] = await prisma.decks.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="group bg-white py-4 px-8 rounded-2xl shadow-md border border-white border-4
          hover:-translate-y-1 hover:shadow-xl hover:shadow-xl
          transition duration-300 ease-out"
        >
          <header className="flex items-center justify-between gap-2">
            <p className="text-2xl truncate flex-1 min-w-0 font-semibold">
              {deck.name}
            </p>
            <DeckActionButtons id={deck.id} />
          </header>
        </div>
      ))}
    </div>
  );
}
