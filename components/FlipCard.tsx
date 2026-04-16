export default function FlipCard({
  isFlipped,
  frontText,
  backText
}: { 
    isFlipped: boolean,
    frontText: string,
    backText: string
  }) {
  return (
    <div style={{ perspective: "1000px" }} className="w-96 h-64">
      <p className="pb-2">プレビュー</p>
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        className="relative w-full h-full"
      >
        {/* 表面 */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 flex items-center justify-center border rounded-xl bg-white"
        >
          <p className="text-2xl font-bold whitespace-pre-wrap">{frontText}</p>
        </div>
        {/* 裏面 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex items-center justify-center border rounded-xl bg-white"
        >
          <p className="text-2xl font-bold whitespace-pre-wrap">{backText}</p>
        </div>
      </div>
    </div>
  )
}
