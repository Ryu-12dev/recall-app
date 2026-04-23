"use server"

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { deleteCard } from "./card";
import { revalidateTag, revalidatePath } from "next/cache";

export async function getReviewCards(id: string) {
  const now = new Date();

  // JSTに変換（+9時間）
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // JSTで「今日の終わり」
  jst.setHours(23, 59, 59, 999);

  // UTCに戻す（-9時間）
  const endOfTodayUTC = new Date(jst.getTime() - 9 * 60 * 60 * 1000);

  const reviewCards = await prisma.cards.findMany({
    where: {
      deckId: id,
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
  });

  return reviewCards;
}

export async function submitReview(id: string, isCorrect: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const card = await prisma.cards.findUnique({
    select: {
      answerAt: true,
      intervalDays: true,
      streak: true,
    },
    where: {
      id,
    }
  });

  if (!card) return;

  const intervalMap = [1, 3, 7, 14, 30];  // 復習間隔
  const intervalDays = intervalMap[card.streak];
  const nextReviewDate = new Date();
  
  if (isCorrect) {
    card.streak++;
    
    if (card.streak === 5) {
      // 削除処理を待機し、再検証が走るようにする
      await deleteCard(id);
      return;
    }
    
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    await prisma.cards.update({
      where: {
        id,
      },
      data: {
        answerAt: nextReviewDate,
        intervalDays,
        streak: card.streak,
      }
    });

  } else {
    await prisma.cards.update({
      where: {
        id,
      },
      data: {
        answerAt: nextReviewDate,
        intervalDays: 0,
        streak: 0,
      }
    });
  }

  await prisma.records.create({
    data: {
      cardId: id,
      userId: user!.id,
      result: isCorrect,
    }
  });

  revalidateTag(`decks-${user!.id}`, "max");
}
