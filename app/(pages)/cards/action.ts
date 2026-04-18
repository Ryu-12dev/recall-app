"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function deleteCard(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await prisma.cards.delete({
    where: {
      id,
    },
  });
  revalidateTag(`cards-${user!.id}`, "max");
}

export async function editCard(id: string, front: string, back: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
}
