"use client"

import { useState } from "react"
import { Pencil, LucideTrash } from "lucide-react";
import IconButton from "@/components/IconButton";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import DeleteDeckModal from "./DeleteDeckModal";
import EditDeckModal from "./EditDeckModal";

export default function DeckActionButtons({ id }: { id: string }) {
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const editModalOpen = () => setIsEditModal(true);
  const editmodalClose = () => setIsEditModal(false);
  const deleteModalOpen = () => setIsDeleteModal(true);
  const deleteModalClose = () => setIsDeleteModal(false);

  return (
    <div className="hidden group-hover:flex items-center gap-6 shrink-0">
      <IconButton onClick={editModalOpen}>
        <Pencil size={17} />
      </IconButton>
      {
        isEditModal &&
          createPortal(
            <Modal onClose={editmodalClose}>
              <EditDeckModal id={id} onClose={editmodalClose}/>
            </Modal>,
            document.body
          )
      }

      <IconButton onClick={deleteModalOpen}>
        <LucideTrash size={17} />
      </IconButton>
      {
        isDeleteModal &&
          createPortal(
            <Modal onClose={deleteModalClose}>
              <DeleteDeckModal id={id}/>
            </Modal>,
            document.body
          )
      }
    </div>
  );
}
