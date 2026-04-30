"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { updateTag } from "next/cache";

export async function addCard(id: string, frontText: string, backText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await prisma.cards.create({
    data: {
      deckId: id,
      front: frontText,
      back: backText,
    }
  });

  updateTag(`cards-${user!.id}`);
  updateTag(`decks-${user!.id}`);
}

export async function deleteCard(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  updateTag(`cards-${user!.id}`);
  updateTag(`decks-${user!.id}`);
}

export async function editCard(id: string, front: string, back: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  updateTag(`cards-${user!.id}`);
  updateTag(`decks-${user!.id}`);
}
