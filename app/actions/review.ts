"use server"

import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { updateTag } from "next/cache";

export async function getReviewCards(id: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  const now = new Date();
  const jstOffset = 9 * 60 * 60 * 1000;
  const endOfTodayUTC = new Date(now.getTime() + jstOffset);
  endOfTodayUTC.setUTCHours(23, 59, 59, 999);
  endOfTodayUTC.setTime(endOfTodayUTC.getTime() - jstOffset);

  const reviewCards = await prisma.cards.findMany({
    where: {
      deckId: id,
      deck: {
        userId,
      },
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
    orderBy: {
      answerAt: "asc",
    },
  });

  return reviewCards;
}

export async function submitReview(id: string, isCorrect: boolean) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

  const card = await prisma.cards.findUnique({
    select: {
      deck: {
        select: {
          userId: true,
        },
      },
      streak: true,
    },
    where: {
      id,
    }
  });
  if (!card) return;
  if (card.deck.userId !== userId) {
    throw new Error("このカードを更新する権限がありません");
  }

  if (isCorrect) {
    const nextStreak = card.streak + 1;

    if (nextStreak >= 5) {
      await prisma.records.deleteMany({
        where: {
          cardId: id,
        }
      });

      await prisma.cards.delete({
        where: {
          id,
        },
      });

      updateTag(`cards-${userId}`);
      updateTag(`decks-${userId}`);
      return;
    }

    const intervalMap = [1, 3, 7, 14, 28];  // 復習間隔
    const intervalDays = intervalMap[card.streak];
    const jstOffset = 9 * 60 * 60 * 1000;
    const nowJST = new Date(new Date().getTime() + jstOffset);
    nowJST.setUTCDate(nowJST.getUTCDate() + intervalDays);
    const nextReviewDate = new Date(nowJST.getTime() - jstOffset);

    await prisma.cards.update({
      where: {
        id,
      },
      data: {
        answerAt: nextReviewDate,
        intervalDays,
        streak: nextStreak,
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
      userId,
      result: isCorrect,
    }
  });
  updateTag(`cards-${userId}`);
}

export async function getCardNumber(id: string) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    throw new Error("ログインが必要です");
  }

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
      deck: {
        userId,
      },
      answerAt: {
        lte: endOfTodayUTC,
      },
    },
  });
}
