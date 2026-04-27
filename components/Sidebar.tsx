"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Activity, LogOut, House } from "lucide-react";
import { signOut } from "@/app/login/action";
import { useEffect, useRef } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const pendingNavigationRef = useRef<{
    href: string;
    pointerDownAt?: number;
    clickAt?: number;
  } | null>(null);
  const handlesignOut = async () => await signOut();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const pending = pendingNavigationRef.current;
    if (!pending || pending.href !== pathname) return;

    const committedAt = performance.now();
    const pointerDelta = pending.pointerDownAt
      ? committedAt - pending.pointerDownAt
      : null;
    const clickDelta = pending.clickAt ? committedAt - pending.clickAt : null;

    console.table({
      href: pending.href,
      pointerToCommitMs:
        pointerDelta === null ? "n/a" : Number(pointerDelta.toFixed(1)),
      clickToCommitMs:
        clickDelta === null ? "n/a" : Number(clickDelta.toFixed(1)),
    });

    pendingNavigationRef.current = null;
  }, [pathname]);

  const markPointerDown = (href: string) => {
    if (process.env.NODE_ENV !== "development") return;

    pendingNavigationRef.current = {
      href,
      pointerDownAt: performance.now(),
    };
  };

  const markClick = (href: string) => {
    if (process.env.NODE_ENV !== "development") return;

    const now = performance.now();
    const current = pendingNavigationRef.current;

    pendingNavigationRef.current = {
      href,
      pointerDownAt: current?.href === href ? current.pointerDownAt : undefined,
      clickAt: now,
    };

    console.log("[nav-debug] click", href, now.toFixed(1));
  };
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
            onPointerDown={() => markPointerDown("/home")}
            onClick={() => markClick("/home")}
            className={`flex items-center p-3 mb-3 rounded-xl
            ${pathname == '/home' ? "bg-neutral-100 text-blue-400" : "hover:bg-neutral-50"}`}
          >
            <House className="mr-4" size={27} />
            <span>ホーム</span>
          </Link>

          <Link 
            href="/cards"
            onPointerDown={() => markPointerDown("/cards")}
            onClick={() => markClick("/cards")}
            className={`flex items-center p-3 mb-3 rounded-xl 
            ${pathname == '/cards' ? "bg-neutral-100 text-blue-400" : "hover:bg-neutral-50"}`}
          >
            <Database className="mr-4" size={27} />
            <span>カード一覧</span>
          </Link>

          <Link 
            href="/home"
            onPointerDown={() => markPointerDown("/home")}
            onClick={() => markClick("/home")}
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
