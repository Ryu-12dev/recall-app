"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, LogOut, House } from "lucide-react";
import { signOut } from "@/app/login/action";

const menuItems = [
  {
    href: "/home",
    name: "ホーム",
    icon: House,
  },
  {
    href: "/cards",
    name: "カード一覧",
    icon: Database,
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const handlesignOut = async () => await signOut();

  return (
    <aside className="border-r border-gray-300 flex flex-col h-screen justify-between bg-white p-4 w-56">
      <div>
        {/* ヘッダー */}
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
        
        {/* メニュー */}
        <nav className="flex flex-col">
          {menuItems.map((item) => {
            const LinkIcon = item.icon;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 mb-3 rounded-xl
                ${pathname === item.href ? "bg-sky-50 text-blue-500" : "hover:bg-gray-50"}`}
              >
                <LinkIcon className="mr-4" size={27} />
                <span>{item.name}</span>
              </Link>
            )
          })}
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
