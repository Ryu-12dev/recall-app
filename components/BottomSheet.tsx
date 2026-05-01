"use client"
import { ReactNode } from "react";

export default function BottomSheet({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* シート本体 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6
          transition-transform duration-300
          ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
        {children}
      </div>
    </>
  );
}
