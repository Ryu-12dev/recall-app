"use client";
import { parseCloze } from "@/lib/cloze";
import MathText from "@/components/MathText";

type Props = {
  text: string;
  revealed: boolean;
  className?: string;
};

export default function ClozeRenderer({ text, revealed, className }: Props) {
  const segments = parseCloze(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <MathText key={i} text={seg.content} inline />;
        }
        return (
          <span key={i} className="relative inline-block mx-0.5">
            <MathText
              text={seg.answer}
              inline
              className={revealed ? "text-blue-600" : "invisible"}
            />
            {!revealed && (
              <span className="absolute bottom-0 left-0 right-0 border-b-2 border-gray-700 pointer-events-none" />
            )}
          </span>
        );
      })}
    </span>
  );
}
