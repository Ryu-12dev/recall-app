"use client";
import { submitReview } from "@/app/actions/review";
import { type Card } from "@/lib/type";
import { useEffect, useState } from "react";
import MathText from "@/components/MathText";
import ClozeRenderer from "@/components/ClozeRenderer";
import { hasCloze } from "@/lib/cloze";

export default function ReviewClient({ reviewCards }: { reviewCards: Card[] }) {
  const [isFront, setIsFront] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => { 
    setIsFront(true);
    setIndex(0);
  }, []);

  const handleCorrect = () => {
    submitReview(reviewCards[index].id, true);
    setIsFront(true);
    setIndex(prev => prev + 1);
  };

  const handleInCorrect = () => {
    submitReview(reviewCards[index].id, false);
    setIsFront(true);
    setIndex(prev => prev + 1);
  };

  if (reviewCards.length === 0 || index >= reviewCards.length) {
    return <p className="text-2xl md:text-4xl text-center">今日のカードは完了しました</p>;
  }

  const card = reviewCards[index];
  const isCloze = hasCloze(card.front);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-between
        w-full max-w-3xl min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
      >
        <div className="w-full">
          {isCloze ? (
            <ClozeRenderer
              text={card.front}
              revealed={!isFront}
              className="text-lg md:text-xl text-center block"
            />
          ) : (
            <>
              <MathText text={card.front} className="text-lg md:text-xl text-center mb-7" />
              {!isFront && (
                <>
                  <hr className="text-gray-400 mb-7" />
                  <MathText text={card.back} className="text-lg md:text-xl text-center" />
                </>
              )}
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
              <button onClick={handleCorrect}
                className="px-4 py-3 rounded-3xl border border-gray-300
                  hover:cursor-pointer hover:bg-gray-100">正解</button>
              <button onClick={handleInCorrect}
                className="px-4 py-3 rounded-3xl border border-gray-300
                  hover:cursor-pointer hover:bg-gray-100">不正解</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
