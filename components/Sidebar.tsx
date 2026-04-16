"use client"

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Database, Activity, LogOut, House} from "lucide-react";
import { signOut } from "@/app/login/action";

export default function Sidebar() {
  return (
    <aside className="border-r border-gray-300 flex flex-col items-center h-screen justify-between">
      <div className="flex flex-col items-center">
        <header className="p-4 mb-4">
          <Link href="/home">
            <Image src="/favicon.ico" alt="app_logo" width={40} height={40} className="hover:cursor-pointer"/>
          </Link>
        </header>
        <main>
          <div className="hover:cursor-pointer hover:bg-neutral-200 hover:text-blue-400 p-3 mb-10 rounded-xl">
            <Link href="/home">
              <House width={27} height={27} />
            </Link>
          </div>
          <div className="hover:cursor-pointer hover:bg-neutral-200 hover:text-blue-400 p-3 mb-10 rounded-xl">
            <Link href="/questions">
              <Database width={27} height={27} />
            </Link>
          </div>
          <div className="hover:cursor-pointer hover:bg-neutral-200 hover:text-blue-400 p-3 rounded-xl">
            <Link href="/activity">
              <Activity width={27} height={27} />
            </Link>
          </div>
        </main>
      </div>
      <footer>
        <form>
          <button formAction={signOut} className="hover:cursor-pointer hover:bg-neutral-200 p-3 rounded-xl">
            <LogOut width={27} height={27} />
          </button>
        </form>
      </footer>
    </aside>
  );
}
