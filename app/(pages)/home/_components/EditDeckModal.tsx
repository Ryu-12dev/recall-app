"use client"
import { useTransition } from "react";
import { editDeck } from "@/app/actions/deck";

export default function EditDeckModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    if (!name.trim()) return;

    startTransition(async () => {
      const result = await editDeck(id, name);
      if (result.error) {
        alert(result.error);
        return;
      }
      onClose();
    });
  };

  return (
    <>
      <p className="text-lg font-bold mb-4">デッキ名を変更</p>
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
          disabled={isPending}
          className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white border p-3 rounded
          hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "更新中..." : "更新"}
        </button>
      </form>
    </>
  );
}
