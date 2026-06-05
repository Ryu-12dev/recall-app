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
          <span
            key={i}
            className={`inline border-b-2 mx-0.5 transition-colors ${
              revealed
                ? "text-blue-600 font-medium border-transparent"
                : "text-transparent border-gray-700"
            }`}
          >
            {seg.answer}
          </span>
        );
      })}
    </span>
  );
}
