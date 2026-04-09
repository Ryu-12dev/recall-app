"use server"

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function addDeck(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインが必要です");
  }

  await prisma.decks.create({
    data: {
      userId: user.id,
      name,
    }
  });
}
