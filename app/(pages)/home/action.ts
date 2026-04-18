"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function addDeck(name: string) {
  if (!name.trim()) {
    return { error: "デッキ名を入力してください。" };
  }
  console.log("addDeck called with name:", name);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User:", user);

  if (!user) {
    throw new Error("ログインが必要です");
  }

  console.log("Creating deck with userId:", user.id, "name:", name);

  await prisma.decks.create({
    data: {
      userId: user.id,
      name,
    },
  });

  console.log("Deck created successfully");

  revalidatePath("/dashboard");

  return { error: null };
}

export async function deleteDeck(id: string) {
  await prisma.decks.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard");
}

export async function editDeck(id: string, name: string) {
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

  revalidatePath("/dashboard");

  return { error: null };
}

export async function addCard(id: string, frontText: string, backText: string) {
  await prisma.cards.create({
    data: {
      deckId: id,
      front: frontText,
      back: backText,
    }
  })
  revalidatePath("/dashboard");
}

export async function getCardNumber(id: string) {
  return await prisma.cards.count({
    where: {
      deckId: id,
    }
  })
}
