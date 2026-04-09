"use client"

import type { Deck } from "@/lib/type";

export default function DashboardClient({ decks }: { decks: Deck[] }) {
  return (
    <div>
      {decks.map(deck => (
        <div key={deck.id}>{deck.name}</div>
      ))}
    </div>
  )
}
