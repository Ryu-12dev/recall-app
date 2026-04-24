import { Suspense } from "react";
import { CardsContent } from "./CardsContent";
import Loading from "../loading";

export default async function Cards() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CardsContent />
      </Suspense>
    </>
  );
}
