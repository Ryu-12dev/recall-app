"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";

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

  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/home");

  return { error: null };
}

export async function deleteDeck(id: string) {
  const user = await getUser();
  await prisma.decks.delete({
    where: {
      id,
    },
  });
  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/home");
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

  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/home");

  return { error: null };
}

export async function getCardNumber(id: string) {
  const now = new Date();

  // JSTに変換
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // JSTで今日の終わり
  jst.setHours(23, 59, 59, 999);

  // UTCに戻す
  const endOfTodayUTC = new Date(jst.getTime() - 9 * 60 * 60 * 1000);

  return await prisma.cards.count({
    where: {
      deckId: id,
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
  });
}
