"use client"
import { type Deck, type Card } from "@/lib/type";
import { useState } from "react";
import { deleteCard } from "@/app/actions/card";
import { createPortal } from "react-dom";
import EditCardModal from "./EditCardModal";
import Modal from "@/components/Modal";

export default function CardsClient({ decks, cards }: { decks: Deck[], cards: Card[] }) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setTimeout(() => setIsOpen(true), 10);
  }

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setEditingCard(null), 300);
  }

  const deckMap = new Map(decks.map(deck => [deck.id, deck.name]));

  const filteredCards: Card[] = selectedDeckId === ""
    ? cards
    : cards.filter(card => card.deckId === selectedDeckId);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <select
          onChange={(e) => setSelectedDeckId(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
        >
          <option value="">すべてのデッキ</option>
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>{deck.name}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filteredCards.length}枚</span>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-sm font-normal text-gray-400 text-left pb-2 px-3 w-28">デッキ</th>
            <th className="text-sm font-normal text-gray-400 text-left pb-2 px-3">表面</th>
            <th className="text-sm font-normal text-gray-400 text-left pb-2 px-3">裏面</th>
            <th className="text-sm font-normal text-gray-400 text-left pb-2 px-3 w-16">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredCards.map((card) => (
            <tr
              key={card.id}
              className="border-b border-gray-300 last:border-none hover:bg-gray-100 transition-colors"
            >
              <td className="py-3 px-3 text-sm text-gray-500">{deckMap.get(card.deckId)}</td>
              <td className="py-3 px-3 text-sm font-medium">{card.front}</td>
              <td className="py-3 px-3 text-sm text-gray-500">{card.back}</td>
              <td className="py-3 px-3">
                <div className="flex items-center justify-end gap-1">
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 
                    hover:bg-gray-100 hover:text-gray-600 
                    transition-colors active:scale-90"
                    onClick={() => handleEdit(card)}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 2l3 3-9 9H2v-3L11 2z"/>
                    </svg>
                  </button>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 
                    hover:bg-red-50 hover:border-red-200 hover:text-red-600 
                    transition-colors active:scale-90"
                    onClick={() => deleteCard(card.id)}
                  >
                    
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3,5 13,5"/>
                      <path d="M6 5V3h4v2M5 5l1 9h4l1-9"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingCard && createPortal(
          <Modal onClose={handleClose} isOpen={isOpen}>
            <EditCardModal 
              id={editingCard.id} 
              front={editingCard.front} 
              back={editingCard.back}
              onClose={handleClose}
            />
          </Modal>,
          document.body
        )
      }
    </div>
    
  );
}
