"use server";

import { prisma } from "@/lib/prisma/prisma";
import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { updateTag } from "next/cache";

async function getUser() {
  const userId = await getAuthenticatedUserId();
  return userId ? { id: userId } : null;
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

  updateTag(`decks-${user.id}`);
  updateTag(`cards-${user.id}`);

  return { error: null };
}

export async function deleteDeck(id: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }
  await prisma.decks.delete({
    where: {
      id,
    },
  });

  updateTag(`decks-${user.id}`);
  updateTag(`cards-${user.id}`);
}

export async function editDeck(id: string, name: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }
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

  updateTag(`decks-${user.id}`);
  updateTag(`cards-${user.id}`);

  return { error: null };
}

