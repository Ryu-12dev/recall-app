"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

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

  // タグとパスの再検証
  revalidateTag(`cards-${user!.id}`, "max");
  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/cards");
  revalidatePath("/home");
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

  // 関連するすべてのキャッシュを破棄
  revalidateTag(`cards-${user!.id}`, "max");
  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/cards");
  revalidatePath("/home");
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

  revalidateTag(`cards-${user!.id}`, "max");
  revalidateTag(`decks-${user!.id}`, "max");
  revalidatePath("/cards");
  revalidatePath("/home");
}
