import { Suspense } from "react";
import { CardsContent } from "./CardsContent";

export default async function Cards() {
  return (
    <>
      <Suspense>
        <CardsContent />
      </Suspense>
    </>
  );
}
