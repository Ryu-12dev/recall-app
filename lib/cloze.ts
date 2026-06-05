export type ClozeSegment =
  | { type: "text"; content: string }
  | { type: "cloze"; index: number; answer: string; hint?: string };

// {{答え}} または {{c1::答え}} の両方に対応
export function parseCloze(text: string): ClozeSegment[] {
  const regex = /\{\{(?:c(\d+)::)?([^}]+)\}\}/g;
  const segments: ClozeSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let autoIndex = 1;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({
      type: "cloze",
      index: match[1] ? parseInt(match[1]) : autoIndex++,
      answer: match[2],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

export function hasCloze(text: string): boolean {
  return /\{\{[^}]+\}\}/.test(text);
}

export function stripCloze(text: string): string {
  return text.replace(/\{\{(?:c\d+::)?([^}]+)\}\}/g, "[＿＿＿]");
}
