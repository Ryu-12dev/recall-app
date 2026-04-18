"use server"

import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";

export default async function deleteCard(id: string) {
  await prisma.cards.delete({
    where: {
      id,
    }
  });

  revalidatePath("/cards");
}

