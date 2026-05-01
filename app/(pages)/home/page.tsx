import { DashboardContent } from "./DashboardContent";
import AddDeckModal from "./AddDeckModal";
import { Suspense } from "react";
import Loading from "../loading";

export default async function Dashboard() {

  return (
    <div className="px-5 pt-20 md:pt-10 md:px-10">
      <header className="mb-5 md:mb-10">
        <AddDeckModal />
      </header>
      <main>
        <Suspense fallback={<Loading />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
