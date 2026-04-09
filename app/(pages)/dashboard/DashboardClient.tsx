"use client"

import { Decks } from "@/app/generated/prisma"

export default function DashboardClient({ decks }: { decks: Decks[] }) {
  return (
    <div>
      {decks.map(deck => (
        <div key={deck.id}>{deck.name}</div>
      ))}
    </div>
  )
}
