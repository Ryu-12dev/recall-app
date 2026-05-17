"use client"

import { useState, useEffect } from "react";
import { Pencil, LucideTrash } from "lucide-react";
import IconButton from "@/components/IconButton";
import { createPortal } from "react-dom";
import Modal from "@/components/Modal";
import DeleteDeckModal from "./DeleteDeckModal";
import EditDeckModal from "./EditDeckModal";

export default function FooterButton({ id }: { id: string }) {
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => setIsMounted(true));
  const editModalOpen = () => setIsEditModal(true);
  const editmodalClose = () => setIsEditModal(false);
  const deleteModalOpen = () => setIsDeleteModal(true);
  const deleteModalClose = () => setIsDeleteModal(false);

  return (
    <>
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
            </>,
            document.body
          )
        }
    </>
  );
}
