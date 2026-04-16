import FlipCard from "./FlipCard";

type Props = {
  isFlipped: boolean;
  frontText: string;
  backText: string;
};

export default function PreviewCardModal({ isFlipped, frontText, backText }: Props) {
  return (
    <>
      <header>
        <h2 className="text-lg font-bold mb-4">プレビュー</h2>
      </header>
      <div className="flex items-center justify-center p-4">
        <FlipCard
          isFlipped={isFlipped}
          frontText={frontText}
          backText={backText}
        />
      </div>
    </>
  );
}
