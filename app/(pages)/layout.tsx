import { ReactNode, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function AuthLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="bg-sky-50 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default async function pagesLayout({children}: {children: ReactNode}) {
  return (
    <Suspense>
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  );
}
