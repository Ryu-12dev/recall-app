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

  console.log("Creating deck with userId:", user.id, "name:", name);

  await prisma.decks.create({
    data: {
      userId: user.id,
      name,
    },
  });

  console.log("Deck created successfully");

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

export async function addCard(id: string, frontText: string, backText: string) {
  const user = await getUser();
  await prisma.cards.create({
    data: {
      deckId: id,
      front: frontText,
      back: backText,
    }
  })
  revalidateTag(`cards-${user!.id}`, "max");
  revalidatePath("/cards");
  revalidatePath("/home");
}

export async function getCardNumber(id: string) {
  return await prisma.cards.count({
    where: {
      deckId: id,
    }
  })
}
