"use server";

import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { updateTag } from "next/cache";

export async function addCard(id: string, frontText: string, backText: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  await prisma.cards.create({
    data: {
      deckId: id,
      front: frontText,
      back: backText,
    }
  });

  updateTag(`cards-${userId}`);
  updateTag(`decks-${userId}`);
}

export async function deleteCard(id: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  await prisma.records.deleteMany({
    where: {
      cardId: id,
    }
  })

  await prisma.cards.delete({
    where: {
      id,
    },
  });

  updateTag(`cards-${userId}`);
  updateTag(`decks-${userId}`);
}

export async function editCard(id: string, front: string, back: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  const card = await prisma.cards.findUnique({
    where: { id },
    select: { deckId: true }
  });

  if (!card) return;

  await prisma.cards.update({
    where: {
      id,
    },
    data: {
      front,
      back,
    },
  });

  updateTag(`cards-${userId}`);
}
