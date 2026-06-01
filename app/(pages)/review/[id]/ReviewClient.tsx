"use client";
import { submitReview } from "@/app/actions/review";
import { type Card } from "@/lib/type";
import { useEffect, useRef, useState } from "react";
import MathText from "@/components/MathText";
import { getCardAnswer, getCardPrompt } from "@/lib/cloze";
import { useRouter } from "next/navigation";

type ReviewSubmission = {
  cardId: string;
  isCorrect: boolean;
};

export default function ReviewClient({ reviewCards }: { reviewCards: Card[] }) {
  const router = useRouter();
  const [cards] = useState<Card[]>(reviewCards);
  const [isFront, setIsFront] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [failedSubmissions, setFailedSubmissions] = useState<ReviewSubmission[]>([]);
  const submissionQueueRef = useRef<Promise<void>>(Promise.resolve());

  const enqueueSubmission = (submission: ReviewSubmission) => {
    setPendingCount(prev => prev + 1);

    const nextSubmission = submissionQueueRef.current.then(() =>
      submitReview(submission.cardId, submission.isCorrect)
    );

    submissionQueueRef.current = nextSubmission.catch(() => undefined);

    nextSubmission
      .catch(() => {
        setFailedSubmissions(prev => [...prev, submission]);
      })
      .finally(() => {
        setPendingCount(prev => Math.max(0, prev - 1));
      });
  };

  const handleResult = (isCorrect: boolean) => {
    const currentCard = cards[index];
    if (!currentCard || failedSubmissions.length > 0) return;

    enqueueSubmission({
      cardId: currentCard.id,
      isCorrect,
    });
    setIsFront(true);
    setIndex(prev => prev + 1);
  };

  const retryFailedSubmissions = () => {
    const submissions = failedSubmissions;
    setFailedSubmissions([]);
    submissions.forEach(enqueueSubmission);
  };

  const isFinished = index >= cards.length;
  const isSaving = pendingCount > 0;
  const hasSaveError = failedSubmissions.length > 0;

  useEffect(() => {
    if (!isFinished || isSaving || hasSaveError || cards.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      router.replace("/home");
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [cards.length, hasSaveError, isFinished, isSaving, router]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl md:text-4xl text-center">今日のカードはありません</p>
      </div>
    );
  } else if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {hasSaveError ? (
          <>
            <p className="text-2xl md:text-4xl text-center">保存に失敗しました</p>
            <button
              onClick={retryFailedSubmissions}
              className="mt-6 px-4 py-3 rounded-3xl border border-gray-300
                hover:cursor-pointer hover:bg-gray-100"
            >
              再試行
            </button>
          </>
        ) : (
          <>
            <p className="text-2xl md:text-4xl text-center">おつかれさまでした</p>
            <p className="text-lg text-center text-gray-400">
              {isSaving ? "保存中..." : "1秒後に遷移します"}
            </p>
          </>
        )}
      </div>
    )
  }

  const currentCard = cards[index];
  const prompt = getCardPrompt(currentCard.front);
  const answer = getCardAnswer(currentCard.front, currentCard.back);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className="flex flex-col items-center justify-between
          w-full max-w-3xl min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
      >
        <div className="w-full">
          <MathText
            text={prompt}
            className="text-lg md:text-xl text-center mb-7"
          />
          {!isFront && (
            <>
              <hr className="text-gray-400 mb-7" />
              <MathText
                text={answer}
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
                onClick={() => handleResult(true)}
                className="px-4 py-3 rounded-3xl border border-gray-300
                  hover:cursor-pointer hover:bg-gray-100"
              >
                正解
              </button>
              <button
                onClick={() => handleResult(false)}
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
