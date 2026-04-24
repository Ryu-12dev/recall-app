import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default async function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="bg-sky-50 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
