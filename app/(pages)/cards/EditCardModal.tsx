"use client"

import { ChangeEvent, useState } from "react";
import { editCard } from "./action";

export default function EditCardModal({
  id,
  front,
  back,
  onClose
}: { 
    id: string,
    front: string,
    back: string,
    onClose: () => void
  }) {
  const [card, setCard] = useState({
    front,
    back,
  });
  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async () => {
    onClose();
    setCard({
      front: "",
      back: ""
    });
    await new Promise(resolve => setTimeout(resolve, 300));
    await editCard(id, card.front, card.back);
  }

  return (
    <>
      <div className="w-xl">
      <header>
        <h2 className="text-lg font-bold mb-4">カードを編集</h2>
      </header>
      <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <p className="text-base mb-2">表</p>
        <textarea 
          name="front"
          value={card.front}
          onChange={handleCard}
          className="border rounded-lg text-2xl w-full mb-2 "
        />
        <p className="text-base mb-2">裏</p>
        <textarea 
          name="back" 
          value={card.back}
          onChange={handleCard}
          className="border rounded-lg text-2xl w-full mb-4 " 
        />
        <button
          type="submit"
          disabled={!card.front || !card.back}
          className="bg-green-400 rounded-lg p-3 text-white w-full
          hover:cursor-pointer
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
          "

        >
          更新する
        </button>
      </form>
      </div>
    </>
  );
}
