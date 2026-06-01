"use client";

import { useRouter } from "next/navigation";

export default function ReviewDeckLink({ id, name }: { id: string, name: string }) {
  const router = useRouter();

  const openReview = () => {
    router.push(`/review/${id}?session=${Date.now()}`);
  };

  return (
    <button
      type="button"
      onClick={openReview}
      className="flex-1 min-w-0 text-left"
    >
      <span className="block text-xl truncate font-semibold hover:cursor-pointer hover:text-blue-500">
        {name}
      </span>
    </button>
  );
}
