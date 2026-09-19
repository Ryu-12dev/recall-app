"use client";
import { submitReview } from "@/app/actions/review";
import { type Card } from "@/lib/type";
import { useEffect, useState } from "react";
import MathText from "@/components/MathText";
import ClozeRenderer from "@/components/ClozeRenderer";
import { hasCloze } from "@/lib/cloze";
import { useRouter } from "next/navigation";

export default function ReviewClient({ reviewCards }: { reviewCards: Card[] }) {
  const [isFront, setIsFront] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  const { replace } = useRouter();

  useEffect(() => {
    console.log(reviewCards);
    return () => {
      setIsFront(true);
      setIndex(0);
    }
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

  if (index === reviewCards.length) {
    setTimeout(() => {
      replace('/home');
    }, 1000)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-2xl md:text-4xl">今日のカードは完了しました</p>
        <p className="text-xl text-gray-400">1秒後に遷移します</p>
      </div>
    );
  }

  const card = reviewCards[index];
  const isCloze = hasCloze(card.front);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative flex flex-col items-center justify-between
        w-full max-w-3xl min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
      >
        <p className="absolute top-6 left-6 text-gray-400 text-lg">
          {index + 1}/{reviewCards.length}
        </p>

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
