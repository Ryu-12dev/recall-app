import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import CardsClient from "./CardsClient";
import { cacheLife, cacheTag } from "next/cache";

export async function CardsContent() {
  const userId = await getAuthenticatedUserId();
  return <CardsCache userId={userId ?? undefined} />;
}

export async function CardsCache({ userId }: { userId: string | undefined }) {
  "use cache";
  cacheTag(`cards-${userId}`);
  cacheLife("max");
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
