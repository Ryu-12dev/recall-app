import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import CardsClient from "./CardsClient";

export default async function CardsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [decks, cards] = await Promise.all([
    prisma.decks.findMany({
      where: {
        userId: user?.id,
      }
    }),
    prisma.cards.findMany({
      where: {
        deck: {
          userId: user?.id,
        }
      },
    })
  ]);

  return <CardsClient decks={decks} cards={cards} />

}
