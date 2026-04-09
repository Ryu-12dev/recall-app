"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import addDeck from "./action";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    await addDeck(name);
    setIsOpen(false);
  };

  return (
    <div className="pl-20 pt-10 pr-20">
      <header className="mb-10">
        <button
          className="hover:cursor-pointer hover:bg-gray-200 bg-white rounded-full p-4"
          onClick={() => setIsOpen(true)}
        >
          <FolderPlus className="text-gray-500" />
        </button>
      </header>
      <main className="">
        <div
          className="hover:border-blue-600 hover:cursor-pointer bg-white border border-slate-100
          border-3 rounded-2xl p-3"
        >
          <h1 className="text-3xl">Title</h1>
        </div>
      </main>
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
                className="w-full border p-2 mb-4 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                作成
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
