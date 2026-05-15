"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  text: string;
  className?: string;
};

export default function MathText({ text, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const html = text
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
        try {
          return katex.renderToString(expr.trim(), { displayMode: true });
        } catch {
          return `<span class="text-red-400">$$${expr}$$</span>`;
        }
      })
      .replace(/\$([\s\S]+?)\$/g, (_, expr) => {
        try {
          return katex.renderToString(expr.trim(), { displayMode: false });
        } catch {
          return `<span class="text-red-400">$${expr}$</span>`;
        }
      })
      .replace(/\n/g, "<br />");

    ref.current.innerHTML = html;
  }, [text]);

  return <div ref={ref} className={className} />;
}
