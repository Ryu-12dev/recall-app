"use client"
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function SidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーボタン（モバイルのみ） */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* 背景オーバーレイ */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* サイドバー本体 */}
      <div
        className={`fixed md:relative z-50 md:z-auto h-screen
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar />
      </div>
    </>
  );
}
