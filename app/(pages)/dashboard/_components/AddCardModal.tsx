"use client"

import { ChangeEvent, useState } from "react";

export default function AddCardModal({ id }: { id: string }) {
  const [card, setCard] = useState({
    front: "",
    back: ""
  });
  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCard({
      ...card,
      [e.target.name]: e.target.value
    })
  }
  return (
    <>
      <header>
        <h2 className="text-lg font-bold mb-4">カード追加</h2>
      </header>
      <form
        className="flex flex-col gap-4"
      >
        <div>
          <p className="text-base mb-2">表</p>
          <textarea 
            name="front"
            value={card.front}
            onChange={handleCard}
            className="border rounded-lg text-2xl"
          />
        </div>
        <div>
          <p className="text-base mb-2">裏</p>
          <textarea 
            name="back" 
            value={card.back}
            onChange={handleCard}
            className="border rounded-lg text-2xl" 
          />
        </div>
      </form>
    </>
  );
}
