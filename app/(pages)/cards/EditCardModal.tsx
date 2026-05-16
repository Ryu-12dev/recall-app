"use client"
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { editCard } from "@/app/actions/card";
import MathText from "@/components/MathText";
import { ArrowLeft, Eye, Sigma } from "lucide-react";
import { getCardAnswer, getCardPrompt, hasCloze } from "@/lib/cloze";
import { TOOLBAR_ITEMS } from "@/lib/toolbar";

type Field = "front" | "back";

export default function EditCardModal({
  id, front, back, onClose
}: {
  id: string;
  front: string;
  back: string;
  onClose: () => void;
}) {
  const [card, setCard] = useState({ front, back });
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeField, setActiveField] = useState<Field>("front");

  const frontRef = useRef<HTMLTextAreaElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showToolbar) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showToolbar]);

  const handleCard = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await editCard(id, card.front, card.back);
      onClose();
    });
  };

  const insertText = (insert: string, cursorBack: number) => {
    const textarea = activeField === "front" ? frontRef.current : backRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue =
      card[activeField].substring(0, start) +
      insert +
      card[activeField].substring(end);

    setCard((prev) => ({ ...prev, [activeField]: newValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + insert.length - cursorBack;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  const isClozeCard = hasCloze(card.front);
  const isSubmitDisabled = !card.front || (!isClozeCard && !card.back) || isPending;
  const isPreviewDisabled = !card.front && !card.back;

  if (showPreview) {
    const previewFront = getCardPrompt(card.front);
    const previewBack = getCardAnswer(card.front, card.back);

    return (
      <div className="w-[min(800px,calc(100vw-3rem))]">
        <header className="mb-4 grid grid-cols-3">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="justify-self-start text-sm text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft size={16} />
              戻る
            </span>
          </button>
          <span className="justify-self-center text-lg font-bold">プレビュー</span>
        </header>
        <div className="flex w-full min-h-[60vh] flex-col items-center justify-between rounded-3xl bg-white px-6 py-10 md:px-10">
          <div className="w-full">
            <MathText text={previewFront} className="mb-7 text-center text-lg md:text-xl" />
            <hr className="mb-7 text-gray-400" />
            <MathText text={previewBack} className="text-center text-lg md:text-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-xl">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">カードを編集</h2>
        <div className="flex items-center gap-6">
          <div className="relative" ref={toolbarRef}>
            <button
              type="button"
              onClick={() => setShowToolbar((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 p-2 text-sm hover:bg-gray-100"
            >
              <Sigma size={18} />
            </button>

            {showToolbar && (
              <div
                className="fixed inset-x-0 bottom-0 z-50 w-full rounded-t-2xl border border-gray-200 bg-white p-2
                  shadow-2xl md:absolute md:right-0 md:top-8 md:bottom-auto md:inset-x-auto md:w-64 md:rounded-xl"
              >
                <div className="grid grid-cols-4 gap-1 md:grid-cols-6">
                  {TOOLBAR_ITEMS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      title={item.title}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertText(item.insert, item.cursorBack);
                      }}
                      className="rounded-md text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isPreviewDisabled}
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 p-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <Eye size={18} />
            プレビュー
          </button>
        </div>
      </header>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <p className="text-base mb-2">表</p>
        <p className="mb-2 text-xs text-gray-400">
          穴埋めは <code>{"{{答え}}"}</code> の形式で入力します。
        </p>
        <textarea
          ref={frontRef}
          name="front"
          value={card.front}
          onChange={handleCard}
          onFocus={() => setActiveField("front")}
          className="border rounded-lg text-xl w-full mb-2 p-2"
        />
        <p className="text-base mb-2">裏</p>
        <p className="mb-2 text-xs text-gray-400">
          穴埋めカードでは、ここに補足説明や解き方を入れられます。
        </p>
        <textarea
          ref={backRef}
          name="back"
          value={card.back}
          onChange={handleCard}
          onFocus={() => setActiveField("back")}
          className="border rounded-lg text-2xl w-full mb-4"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-green-400 rounded-lg p-3 text-white w-full
          hover:cursor-pointer
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "更新中..." : "更新する"}
        </button>
      </form>
    </div>
  );
}
