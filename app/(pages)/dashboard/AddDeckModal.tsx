"use client"

import { useEffect, useState } from "react";
import { FolderPlus } from "lucide-react";
import addDeck from "./action";
import Modal from "@/components/Modal";
import { createPortal } from "react-dom";

export default function AddDeckModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => setIsMounted(true), []);

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
        className="text-white rounded-full p-4
        bg-gradient-to-r from-sky-500 to-blue-700
        hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <FolderPlus />
      </button>
      {
        isMounted &&
        createPortal(
          <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
            <p className="text-lg font-bold mb-4">デッキを作成</p>
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
          </Modal>,
          document.body
        )
      }
    </>
  )
}
