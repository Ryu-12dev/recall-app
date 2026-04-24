"use client"
import { ChangeEvent, useState, useTransition } from "react";
import { addCard } from "@/app/actions/card";

export default function AddCardModal({ id }: { id: string }) {
  const [card, setCard] = useState({ front: "", back: "" });
  const [isPending, startTransition] = useTransition();

  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await addCard(id, card.front, card.back);
      setCard({ front: "", back: "" });
    });
  };

  return (
    <div className="w-xl">
      <header>
        <h2 className="text-lg font-bold mb-4">カード追加</h2>
      </header>
      <form action={handleSubmit}>
        <p className="text-base mb-2">表</p>
        <textarea
          name="front"
          value={card.front}
          onChange={handleCard}
          className="border rounded-lg text-2xl w-full mb-2"
        />
        <p className="text-base mb-2">裏</p>
        <textarea
          name="back"
          value={card.back}
          onChange={handleCard}
          className="border rounded-lg text-2xl w-full mb-4"
        />
        <button
          type="submit"
          disabled={!card.front || !card.back || isPending}
          className="bg-blue-400 rounded-lg p-3 text-white w-full
            hover:cursor-pointer
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "追加中..." : "追加する"}
        </button>
      </form>
    </div>
  );
}
