import type { Deck } from "@/lib/type";
import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const decks: Deck[] = await prisma.decks.findMany({
    where: {
      userId: user?.id,
    }
  });

  return (
    <div className="grid grid-cols-4 gap-10">
      {decks.map(deck => (
        <div
          key={deck.id}
          className="bg-white py-4 px-8 rounded-2xl shadow-xl"
        >
          <header className="flex ">
            <p className="text-2xl">
              {deck.name}
            </p>
          </header>
        </div>
      ))}
    </div>
  )
}
