import { Suspense } from "react";
import ReviewClient from "./ReviewClient";
import { getReviewCards } from "@/app/actions/review";
import Loading from "../../loading";

type ParamProps = {
  params: Promise<{ id: string }>;
};

async function ReviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cards = await getReviewCards(id);
  return <ReviewClient cards={cards} />;
}

export default function Review({ params }: ParamProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ReviewContent params={params} />
    </Suspense>
  );
}
