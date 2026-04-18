"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Activity, LogOut, House } from "lucide-react";
import { signOut } from "@/app/login/action";

export default function Sidebar() {
  const pathname = usePathname();
  const handlesignOut = async () => await signOut();
  return (
    <aside className="border-r border-gray-300 flex flex-col h-screen justify-between p-4">
      
      {/* 上部 */}
      <div>
        <header className="p-2 mb-4">
          <Link href="/home" className="flex items-center">
            <Image 
              src="/favicon.ico" 
              alt="app_logo"
              width={37}
              height={37}
              className="mr-3"
            />
            <h1 className="text-3xl font-bold">Recall</h1>
          </Link>
        </header>

        <nav className="flex flex-col">
          <Link 
            href="/home"
            className={`flex items-center p-3 mb-3 rounded-xl
            ${pathname == '/home' ? "bg-neutral-100 text-blue-400" : "hover:bg-neutral-50"}`}
          >
            <House className="mr-4" size={27} />
            <span>ホーム</span>
          </Link>

          <Link 
            href="/cards"
            className={`flex items-center p-3 mb-3 rounded-xl 
            ${pathname == '/cards' ? "bg-neutral-100 text-blue-400" : "hover:bg-neutral-50"}`}
          >
            <Database className="mr-4" size={27} />
            <span>カード一覧</span>
          </Link>

          <Link 
            href="/home"
            className="flex items-center p-3 mb-3 rounded-xl hover:bg-neutral-50"
          >
            <Activity className="mr-4" size={27} />
            <span>Coming Soon</span>
          </Link>
        </nav>
      </div>

      {/* フッター */}
      <footer>
        <button 
          type="submit"
          onClick={handlesignOut}
          className="flex items-center w-full p-3 rounded-xl
          hover:bg-neutral-100 hover:text-blue-400 hover:cursor-pointer"
        >
          <LogOut className="mr-4" size={27} />
          <span>ログアウト</span>
        </button>
      </footer>

    </aside>
  );
}
