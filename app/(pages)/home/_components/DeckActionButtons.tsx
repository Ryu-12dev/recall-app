"use client"

import { useState, useEffect } from "react"
import { Pencil, LucideTrash, Plus } from "lucide-react";
import IconButton from "@/components/IconButton";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import DeleteDeckModal from "./DeleteDeckModal";
import EditDeckModal from "./EditDeckModal";
import AddCardModal from "./AddCardModal";

export default function DeckActionButtons({ id }: { id: string }) {
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isCardModal, setIsCardModal] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => setIsMounted(true));
  const editModalOpen = () => setIsEditModal(true);
  const editmodalClose = () => setIsEditModal(false);
  const deleteModalOpen = () => setIsDeleteModal(true);
  const deleteModalClose = () => setIsDeleteModal(false);
  const cardModalOpen = () => setIsCardModal(true);
  const cardModalClose = () => setIsCardModal(false);

  return (
    <div className="flex items-center gap-6">
      <div className="hidden group-hover:flex items-center gap-6 shrink-0">
        <IconButton onClick={editModalOpen}>
          <Pencil size={17} />
        </IconButton>

        <IconButton onClick={deleteModalOpen}>
          <LucideTrash size={17} />
        </IconButton>

        {
          isMounted &&
            createPortal(
              <>
                <Modal onClose={editmodalClose} isOpen={isEditModal}>
                  <EditDeckModal id={id} onClose={editmodalClose}/>
                </Modal>
                <Modal onClose={deleteModalClose} isOpen={isDeleteModal}>
                  <DeleteDeckModal id={id}/>
                </Modal>
                <Modal onClose={cardModalClose} isOpen={isCardModal}>
                  <AddCardModal id={id}/>
                </Modal>
              </>,
              document.body
            )
        }
      </div>
      <button
        className="bg-blue-400 p-2 text-white rounded-full
          hover:cursor-pointer"
        onClick={cardModalOpen}
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
