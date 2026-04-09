import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function DeckList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const decks = await prisma.decks.findMany({
    where: {
      userId: user?.id
    }
  })
  
  return (
    <div className="flex">
      {decks.map((deck) => (
        <div 
          key={deck.id}
          className="p-10"
        >
          <p>{deck.name}</p>
        </div>
      ))}
    </div>
  );
}
