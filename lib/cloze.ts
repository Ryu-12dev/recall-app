const CLOZE_PATTERN = /\{\{([\s\S]+?)\}\}/g;
const CLOZE_DETECT_PATTERN = /\{\{[\s\S]+?\}\}/;

export function hasCloze(text: string) {
  return CLOZE_DETECT_PATTERN.test(text);
}

export function maskCloze(text: string) {
  return text.replace(CLOZE_PATTERN, (_match, answer: string) => {
    const trimmed = answer.trim();
    const width = Math.max(trimmed.length, 4);
    return "＿".repeat(width);
  });
}

export function revealCloze(text: string) {
  return text.replace(CLOZE_PATTERN, (_match, answer: string) => answer.trim());
}

export function highlightClozeAnswers(text: string) {
  return text.replace(CLOZE_PATTERN, (_match, answer: string) => {
    const trimmed = answer.trim();
    return `<span class="font-semibold text-blue-500">${trimmed}</span>`;
  });
}

export function getCardPrompt(front: string) {
  return hasCloze(front) ? maskCloze(front) : front;
}

export function getCardAnswer(front: string, back: string) {
  if (!hasCloze(front)) return back;

  const revealed = highlightClozeAnswers(front);
  return back.trim() ? `${revealed}\n\n${back}` : revealed;
}
