"use server";

import { prisma } from "@/lib/prisma/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function addDeck(name: string) {
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
}
