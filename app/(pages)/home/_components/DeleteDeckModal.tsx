"use client"
import { useTransition } from "react";
import { deleteDeck } from "@/app/actions/deck";

export default function DeleteDeckModal({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDeck(id);
    });
  };

  return (
    <>
      <p className="text-lg font-bold mb-4">本当に削除しますか?</p>
      <p className="text-sm text-gray-400 mb-4">このデッキのカードは全て削除されます。</p>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="w-full bg-white text-red-800 border border-red-500 p-3 rounded
        hover:cursor-pointer hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-700
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "削除中..." : "削除"}
      </button>
    </>
  );
}
