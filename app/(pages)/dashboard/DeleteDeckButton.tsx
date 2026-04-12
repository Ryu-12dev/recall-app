"use client"

import { useState } from "react"
import { createPortal } from "react-dom";
import { LucideTrash } from "lucide-react"
import DeleteDeckModal from "./DeleteDeckModal";

export default function DeleteDeckButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className="text-gray-400 hover:text-black hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <LucideTrash size={17} />
      </button>
      {
        isOpen && 
          createPortal(
            <DeleteDeckModal id={id} onClose={() => setIsOpen(false)}/>,
            document.body
          )
      }
    </>
  )
}
