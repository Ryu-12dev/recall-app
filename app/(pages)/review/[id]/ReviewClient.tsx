"use client";
import { submitReview } from "@/app/actions/review";
import { type Card } from "@/lib/type";
import { useState } from "react";
import MathText from "@/components/MathText";

export default function ReviewClient({ reviewCards }: { reviewCards: Card[] }) {
  const [cards] = useState<Card[]>(reviewCards);
  const [isFront, setIsFront] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  const handleCorrect = () => {
    submitReview(cards[index].id, true);
    setIsFront(true);
    setIndex(prev => prev + 1);
  };

  const handleInCorrect = () => {
    submitReview(cards[index].id, false);
    setIsFront(true);
    setIndex(prev => prev + 1);
  };

  if (cards.length === 0 || index + 1 > cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl md:text-4xl text-center">今日のカードは完了しました</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className="flex flex-col items-center justify-between
          w-full max-w-3xl min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
      >
        <div className="w-full">
          <MathText
            text={cards[index].front}
            className="text-lg md:text-xl text-center mb-7"
          />
          {!isFront && (
            <>
              <hr className="text-gray-400 mb-7" />
              <MathText
                text={cards[index].back}
                className="text-lg md:text-xl text-center"
              />
            </>
          )}
        </div>
        <div>
          {isFront ? (
            <button
              onClick={() => setIsFront(false)}
              className="px-4 py-3 rounded-3xl bg-white border border-gray-300
                hover:cursor-pointer hover:bg-gray-100"
            >
              解答を見る
            </button>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCorrect}
                className="px-4 py-3 rounded-3xl border border-gray-300
                  hover:cursor-pointer hover:bg-gray-100"
              >
                正解
              </button>
              <button
                onClick={handleInCorrect}
                className="px-4 py-3 rounded-3xl border border-gray-300
                  hover:cursor-pointer hover:bg-gray-100"
              >
                不正解
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
