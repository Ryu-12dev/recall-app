"use server"

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { deleteCard } from "./card";
import { updateTag } from "next/cache";

export async function getReviewCards(id: string) {
  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const endOfTodayUTC = new Date(now.getTime() + jstOffset);
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  endOfTodayUTC.setTime(endOfTodayUTC.getTime() - jstOffset);
  console.log(endOfTodayUTC);

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
  const intervalMap = [1, 3, 7, 14, 28];  // 復習間隔
  const intervalDays = intervalMap[card.streak];
  const jstOffset = 9 * 60 * 60 * 1000;
  const nowJST = new Date(new Date().getTime() + jstOffset);
  nowJST.setUTCDate(nowJST.getUTCDate() + intervalDays);
  const nextReviewDate = new Date(nowJST.getTime() - jstOffset);

  if (isCorrect) {
    card.streak++;

    if (card.streak === 5) {
      // 削除処理を待機し、再検証が走るようにする
      await deleteCard(id);
      return;
    }

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
  updateTag(`decks-${user!.id}`);
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
