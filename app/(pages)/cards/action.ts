"use server"

import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCard(id: string) {
  await prisma.cards.delete({
    where: {
      id,
    }
  });

  revalidatePath("/cards");
}

export async function editCard(id: string, front: string, back: string) {
  await prisma.cards.update({
    where: {
      id,
    },
    data: {
      front,
      back
    }
  })
}

