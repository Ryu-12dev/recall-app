"use client";
import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  text: string;
  className?: string;
  inline?: boolean;
};

export default function MathText({ text, className, inline = false }: Props) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);

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

  if (inline) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className={className} />;
  }
  return <div ref={ref as React.RefObject<HTMLDivElement>} className={className} />;
}
