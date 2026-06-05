"use client";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { addCard } from "@/app/actions/card";
import MathText from "@/components/MathText";
import { Eye, ArrowLeft, Sigma } from "lucide-react";
import { CardType } from "@/app/generated/prisma/enums";
import { hasCloze } from "@/lib/cloze";

type Field = "front" | "back";

const TOOLBAR_ITEMS = [
  { label: "$…$",   insert: "$$",              cursorBack: 1, title: "インライン数式" },
  { label: "$$…$$", insert: "$$$$",            cursorBack: 2, title: "ブロック数式" },
  { label: "a/b",   insert: "\\frac{}{}",      cursorBack: 1, title: "分数" },
  { label: "√",     insert: "\\sqrt{}",        cursorBack: 1, title: "平方根" },
  { label: "xⁿ",    insert: "^{}",             cursorBack: 1, title: "指数" },
  { label: "xₙ",    insert: "_{}",             cursorBack: 1, title: "添字" },
  { label: "Σ",     insert: "\\sum_{i=1}^{n}", cursorBack: 0, title: "シグマ" },
  { label: "∫",     insert: "\\int_{}^{}",     cursorBack: 4, title: "積分" },
  { label: "π",     insert: "\\pi ",           cursorBack: 0, title: "π" },
  { label: "α",     insert: "\\alpha ",        cursorBack: 0, title: "α" },
  { label: "β",     insert: "\\beta ",         cursorBack: 0, title: "β" },
  { label: "θ",     insert: "\\theta ",        cursorBack: 0, title: "θ" },
  { label: "∞",     insert: "\\infty ",        cursorBack: 0, title: "∞" },
  { label: "±",     insert: "\\pm ",           cursorBack: 0, title: "±" },
  { label: "×",     insert: "\\times ",        cursorBack: 0, title: "×" },
  { label: "≤",     insert: "\\leq ",          cursorBack: 0, title: "≤" },
  { label: "≥",     insert: "\\geq ",          cursorBack: 0, title: "≥" },
];

export default function AddCardModal({ id }: { id: string }) {
  const [card, setCard] = useState({ front: "", back: "" });
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

  const isCloze = hasCloze(card.front);

  const handleSubmit = () => {
    startTransition(async () => {
      const cardType = hasCloze(card.front) ? CardType.CLOZE : CardType.BASIC;
      await addCard(id, card.front, card.back, cardType);
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

  if (showPreview) {
    return (
      <div className="w-[min(800px,calc(100vw-3rem))]">
        <header className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 text-sm text-neutral-500
              hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft size={16} />
            戻る
          </button>
          <span className="text-lg font-bold">プレビュー</span>
          <div className="w-14" />
        </header>
        <div className="flex flex-col items-center justify-between
          w-full min-h-[60vh] bg-white rounded-3xl py-10 px-6 md:px-10"
        >
          <div className="w-full">
            <MathText text={card.front} className="text-lg md:text-xl text-center mb-7" />
            {card.back && (
              <>
                <hr className="text-gray-400 mb-7" />
                <MathText text={card.back} className="text-lg md:text-xl text-center" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-xl">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">カードを追加</h2>
        <div className="flex items-center gap-3">
          {/* 数式ボタン */}
          <div className="relative" ref={toolbarRef}>
            <button
              type="button"
              onClick={() => setShowToolbar(prev => !prev)}
              className={`flex items-center gap-1.5 text-sm transition-colors
                ${showToolbar ? "text-blue-500" : "text-neutral-500 hover:text-neutral-800"}`}
            >
              <Sigma size={15} />
              数式
            </button>
            {showToolbar && (
              <div className="absolute right-0 top-8 z-10 w-64 p-2 bg-white rounded-xl
                shadow-lg border border-gray-200 flex flex-wrap gap-1"
              >
                {TOOLBAR_ITEMS.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    title={item.title}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertText(item.insert, item.cursorBack);
                    }}
                    className="px-2 py-1 text-sm rounded-md hover:bg-gray-100
                      transition-colors text-gray-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* プレビューボタン */}
          <button
            type="button"
            disabled={!card.front}
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 text-sm text-neutral-500
              hover:text-neutral-800 transition-colors
              disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <Eye size={15} />
            プレビュー
          </button>
        </div>
      </header>

      <form action={handleSubmit}>
        <p className="text-base mb-2">表</p>
        <textarea
          ref={frontRef}
          name="front"
          value={card.front}
          onChange={handleCard}
          onFocus={() => setActiveField("front")}
          className="border rounded-lg text-xl w-full mb-2"
        />
        <p className="text-base mb-2">
          裏
          {isCloze && <span className="text-sm text-neutral-400 ml-2">（任意）</span>}
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
          disabled={!card.front || (!isCloze && !card.back) || isPending}
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
