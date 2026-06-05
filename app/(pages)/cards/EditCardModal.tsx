"use client";
import { ChangeEvent, useState, useTransition } from "react";
import { editCard } from "@/app/actions/card";
import { CardType } from "@/app/generated/prisma/enums";
import { hasCloze } from "@/lib/cloze";

export default function EditCardModal({
  id, front, back, cardType: initialCardType, onClose
}: {
  id: string;
  front: string;
  back: string;
  cardType: CardType;
  onClose: () => void;
}) {
  const [card, setCard] = useState({ front, back });
  const [cardType, setCardType] = useState<CardType>(initialCardType);
  const [isPending, startTransition] = useTransition();

  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const updated = { ...card, [e.target.name]: e.target.value };
    setCard(updated);
    if (e.target.name === "front") {
      setCardType(hasCloze(updated.front) ? CardType.CLOZE : CardType.BASIC);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await editCard(id, card.front, card.back, cardType);
      onClose();
    });
  };

  return (
    <div className="w-full md:w-xl">
      <header>
        <h2 className="text-lg font-bold mb-4">カードを編集</h2>
      </header>

      {/* タイプ切り替え */}
      <div className="flex gap-2 mb-4">
        {([CardType.BASIC, CardType.CLOZE] as CardType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setCardType(t)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors
              ${cardType === t
                ? "bg-green-400 text-white border-green-400"
                : "text-neutral-500 border-gray-300 hover:bg-gray-100"}`}
          >
            {t === CardType.BASIC ? "通常" : "穴埋め"}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <p className="text-base mb-2">
          {cardType === CardType.CLOZE ? "問題文（{{c1::答え}}形式）" : "表"}
        </p>
        <textarea
          name="front"
          value={card.front}
          onChange={handleCard}
          className="border rounded-lg text-xl w-full mb-2 p-2"
        />
        {cardType === CardType.BASIC && (
          <>
            <p className="text-base mb-2">裏</p>
            <textarea
              name="back"
              value={card.back}
              onChange={handleCard}
              className="border rounded-lg text-2xl w-full mb-4 p-2"
            />
          </>
        )}
        {cardType === CardType.CLOZE && <div className="mb-4" />}
        <button
          type="submit"
          disabled={!card.front || (cardType === CardType.BASIC && !card.back) || isPending}
          className="bg-green-400 rounded-lg p-3 text-white w-full
            hover:cursor-pointer
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "更新中..." : "更新する"}
        </button>
      </form>
    </div>
  );
}
