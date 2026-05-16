"use client";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { addCard } from "@/app/actions/card";
import MathText from "@/components/MathText";
import { Eye, ArrowLeft, Sigma } from "lucide-react";
import { TOOLBAR_ITEMS } from "@/lib/toolbar";
import { getCardAnswer, getCardPrompt, hasCloze } from "@/lib/cloze";

type Field = "front" | "back";


export default function AddCardModal({ id }: { id: string }) {
  const [card, setCard] = useState({ front: "", back: "" });
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeField, setActiveField] = useState<Field>("front");

  const frontRef = useRef<HTMLTextAreaElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // ツールバー外クリックで閉じる
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
      await addCard(id, card.front, card.back);
      setCard({ front: "", back: "" });
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

    setCard(prev => ({ ...prev, [activeField]: newValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + insert.length - cursorBack;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  const isClozeCard = hasCloze(card.front);
  const isSubmitDisabled = !card.front || (!isClozeCard && !card.back) || isPending;

  if (showPreview) {
    const previewFront = getCardPrompt(card.front);
    const previewBack = getCardAnswer(card.front, card.back);

    return (
      <div className="w-[min(800px,calc(100vw-3rem))]">
        <header className="grid grid-cols-3 mb-4">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 text-sm text-neutral-500 justify-self-start
              hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft size={16} />
            戻る
          </button>
          <span className="text-lg justify-self-center font-bold">プレビュー</span>
        </header>
        <div
          className="flex flex-col items-center justify-between
            w-full min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
        >
          <div className="w-full">
            <MathText text={previewFront} className="text-lg md:text-xl text-center mb-7" />
            <hr className="text-gray-400 mb-7" />
            <MathText text={previewBack} className="text-lg md:text-xl text-center" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-xl">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">カードを追加</h2>
        <div className="flex items-center gap-6">
          {/* 数式ボタン */}
          <div className="relative" ref={toolbarRef}>
            <button
              type="button"
              onClick={() => setShowToolbar(prev => !prev)}
              className="flex items-center gap-1.5 text-sm rounded-full border border-gray-200 p-2
              hover:bg-gray-100"

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
                      className="text-sm rounded-md hover:bg-gray-100
                        transition-colors text-gray-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* プレビューボタン */}
          <button
            type="button"
            disabled={!card.front && !card.back}
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 text-sm p-2 rounded-full border border-gray-200
              hover:bg-gray-100
              disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <Eye size={18} />
            プレビュー
          </button>
        </div>
      </header>

      <form action={handleSubmit}>
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
          className="border rounded-lg text-xl w-full mb-2"
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
          className="border rounded-lg text-xl w-full mb-4"
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-blue-400 rounded-lg p-3 text-white w-full
            hover:cursor-pointer
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "追加中..." : "追加する"}
        </button>
      </form>
    </div>
  );
}
