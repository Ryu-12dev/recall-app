"use client"

import { LucideTrash } from "lucide-react"
import { deleteDeck } from "./action"

export default function DeleteDeckButton({ id }: { id: string }) {
  return (
    <button
      className="text-gray-500 hover:text-black hover:cursor-pointer"
      onClick={() => deleteDeck(id)}
    >
      <LucideTrash size={17} />
    </button>
  )
}
