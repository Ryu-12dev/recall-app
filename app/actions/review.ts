"use server"

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { deleteCard } from "./card";

export async function getReviewCards(id: string) {
  const today = new Date();
  const reviewCards = await prisma.cards.findMany({
    where: {
      deckId: id,
      answerAt: {
        lte: today
      },
    }
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

  const intervalMap = [1, 3, 7, 14, 30];  // 復習間隔
  const intervalDays = intervalMap[card!.streak];
  const nextReviewDate = new Date();
  
  if (isCorrect) {
    card!.streak++;
    
    if (card!.streak === 5) {
      deleteCard(id);
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
        streak: card!.streak,
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
}
