import { Suspense } from "react";
import ReviewClient from "./ReviewClient";
import { getReviewCards } from "@/app/actions/review";

type ParamProps = {
  params: Promise<{ id: string }>;
};

async function ReviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviewCards = await getReviewCards(id);
  return <ReviewClient key={crypto.randomUUID()} reviewCards={reviewCards} />;
}

export default function Review({ params }: ParamProps) {
  return (
    <Suspense fallback={<p className="text-center">読み込み中...</p>}>
      <ReviewContent params={params} />
    </Suspense>
  );
}
