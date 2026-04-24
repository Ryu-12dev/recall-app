import { DashboardContent } from "./DashboardContent";
import AddDeckModal from "./AddDeckModal";
import { Suspense } from "react";
import Loading from "../loading";

export default async function Dashboard() {

  return (
    <div className="pl-20 pt-10 pr-20">
      <header className="mb-10">
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
