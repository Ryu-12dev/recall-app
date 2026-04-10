import DashboardClient from "./DashboardClient";
import AddDeckModal from "./AddDeckModal";

export default function Dashboard() {
  return (
    <div className="pl-20 pt-10 pr-20">
      <header className="mb-10">
        <AddDeckModal />
      </header>
      <main className="">
        <div
          className="hover:border-blue-600 hover:cursor-pointer bg-white border border-slate-100
          border-3 rounded-2xl p-3"
        >
          <h1 className="text-3xl">Title</h1>
        </div>
      </main>
    </div>
  );
}
