"use client"
import { type Deck, type Card } from "@/lib/type";
import { useState } from "react";

export default function CardsClient({ decks, cards }: { decks: Deck[], cards: Card[] }) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  
  const deckMap = new Map(decks.map(deck => [deck.id, deck.name]));
  
  const filteredCards: Card[] = selectedDeckId === ""
    ? cards
    : cards.filter(card => card.deckId === selectedDeckId);

  return (
    <div className="p-4">
      <select
        onChange={(e) => setSelectedDeckId(e.target.value)}
        className="mb-4 border rounded p-2"
      >
        <option value="">全て</option>
        {decks.map((deck) => (
          <option key={deck.id} value={deck.id}>{deck.name}</option>
        ))}
      </select>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">デッキ</th>
            <th className="border p-2 text-left">表面</th>
            <th className="border p-2 text-left">裏面</th>
            <th className="border p-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50">
              <td className="border p-2">{deckMap.get(card.deckId)}</td>
              <td className="border p-2">{card.front}</td>
              <td className="border p-2">{card.back}</td>
              <td className="border p-2 space-x-2">
                <button className="text-blue-500">編集</button>
                <button className="text-red-500">削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
