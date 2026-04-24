import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import CardsClient from "./CardsClient";
import { cacheLife, cacheTag } from "next/cache";

export async function CardsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <CardsCache userId={user?.id} />;
}

export async function CardsCache({ userId }: { userId: string | undefined }) {
  "use cache";
  cacheTag(`cards-${userId}`);
  cacheLife("max");
  console.log("DBから取得");
  const [decks, cards] = await Promise.all([
    prisma.decks.findMany({
      where: {
        userId: userId,
      },
    }),
    prisma.cards.findMany({
      where: {
        deck: {
          userId: userId,
        },
      },
    }),
  ]);

  return <CardsClient decks={decks} cards={cards} />;
}
