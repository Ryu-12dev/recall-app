"use client"

import { useState } from "react";
import addDeck from "./action";
import { FolderPlus } from "lucide-react";

export default function AddDeckModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name.trim()) {
      return ;
    }
    const result = await addDeck(name);
    if (result.error) {
      alert(result.error);
    }
    setIsOpen(false);
  };
  return (
    <>
      <button
        className="text-white rounded-full p-4
        bg-gradient-to-r from-sky-500 to-blue-700
        hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <FolderPlus />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">デッキ作成</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="デッキ名"
                autoComplete="off"
                autoFocus={true}
                className="w-full border p-2 mb-4 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded
                hover:cursor-pointer bg-gradient-to-r from-sky-500 to-blue-700"
              >
                作成
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
