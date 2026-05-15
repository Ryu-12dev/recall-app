"use client";
import { ChangeEvent, useState, useTransition } from "react";
import { addCard } from "@/app/actions/card";
import MathText from "@/components/MathText";
import { Eye, ArrowLeft } from "lucide-react";

export default function AddCardModal({ id }: { id: string }) {
  const [card, setCard] = useState({ front: "", back: "" });
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);

  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await addCard(id, card.front, card.back);
      setCard({ front: "", back: "" });
    });
  };

  if (showPreview) {
    return (
      <div className="w-[min(800px,calc(100vw-3rem))]">
        {/* ヘッダー */}
        <header className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 text-sm text-neutral-500
              hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft size={16} />
            戻る
          </button>
          <span className="text-lg font-bold">プレビュー</span>
          <div className="w-14" />
        </header>

        {/* ReviewClientと同じカード */}
        <div
          className="flex flex-col items-center justify-between
            w-full min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
        >
          <div className="w-full">
            <MathText
              text={card.front}
              className="text-lg md:text-xl text-center mb-7"
            />
            <hr className="text-gray-400 mb-7" />
            <MathText
              text={card.back}
              className="text-lg md:text-xl text-center"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-xl">
      {/* ヘッダー */}
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">カードを追加</h2>
        <button
          type="button"
          disabled={!card.front && !card.back}
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-1.5 text-sm text-neutral-500
            hover:text-neutral-800 transition-colors
            disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <Eye size={15} />
          プレビュー
        </button>
      </header>

      {/* フォーム */}
      <form action={handleSubmit}>
        <p className="text-base mb-2">表</p>
        <textarea
          name="front"
          value={card.front}
          onChange={handleCard}
          className="border rounded-lg text-xl w-full mb-2"
        />
        <p className="text-base mb-2">裏</p>
        <textarea
          name="back"
          value={card.back}
          onChange={handleCard}
          className="border rounded-lg text-xl w-full mb-4"
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
