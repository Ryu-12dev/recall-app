import { Suspense } from "react";
import ReviewClient from "./ReviewClient";
import { getReviewCards } from "@/app/actions/review";
import Loading from "../../loading";

type ParamProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
};

async function ReviewContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const { id } = await params;
  const { session } = await searchParams;
  const reviewCards = await getReviewCards(id);
  return <ReviewClient key={`${id}-${session ?? ""}`} reviewCards={reviewCards} />;
}

export default function Review({ params, searchParams }: ParamProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ReviewContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
