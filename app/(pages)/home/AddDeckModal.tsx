"use client"

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import addDeck from "./action";
import Modal from "@/components/Modal";

export default function AddDeckModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSubmit = async (formData: FormData) => {
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
        className="text-white rounded-xl p-4 flex items-center justify-center gap-3
        bg-gradient-to-r from-sky-500 to-blue-700
        hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <FolderPlus />
        <span>デッキを追加</span>
      </button>
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <p className="text-lg font-bold mb-4">デッキを追加</p>
        <form action={handleSubmit}>
          <input
            ref={el => el?.focus()}
            type="text"
            name="name"
            placeholder="デッキ名"
            autoComplete="off"
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
      </Modal>
    </>
  )
}
