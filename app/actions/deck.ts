"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export default async function addDeck(name: string) {
  const user = await getUser();
  if (!name.trim()) {
    return { error: "デッキ名を入力してください。" };
  }

  if (!user) {
    throw new Error("ログインが必要です");
  }

  await prisma.decks.create({
    data: {
      userId: user.id,
      name,
    },
  });

  updateTag(`decks-${user!.id}`);

  return { error: null };
}

export async function deleteDeck(id: string) {
  const user = await getUser();
  await prisma.decks.delete({
    where: {
      id,
    },
  });

  updateTag(`decks-${user!.id}`);
  updateTag(`cards-${user!.id}`);
}

export async function editDeck(id: string, name: string) {
  const user = await getUser();
  if (!name.trim()) {
    return { error: "デッキ名を入力してください。" };
  }
  await prisma.decks.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  updateTag(`decks-${user!.id}`);
  updateTag(`cards-${user!.id}`);

  return { error: null };
}

export async function getCardNumber(id: string) {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const endOfTodayUTC = new Date(now.getTime() + jstOffset);
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  endOfTodayUTC.setTime(endOfTodayUTC.getTime() - jstOffset);

  console.log(endOfTodayUTC);

  return await prisma.cards.count({
    where: {
      deckId: id,
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
  });
}
