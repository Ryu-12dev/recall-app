import { ReactNode, Suspense } from "react";
import SidebarWrapper from "@/components/SidebarWrapper";

export default async function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Suspense>
        <SidebarWrapper />
      </Suspense>
      <main className="bg-sky-50 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
