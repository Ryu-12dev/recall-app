import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function pagesLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="bg-sky-50 flex-1">{children}</main>
    </div>
  );
}
