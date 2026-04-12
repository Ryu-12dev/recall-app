import { deleteDeck } from "../action";

export default function DeleteDeckModal({ id }: { id: string }) {
  return (
    <>
      <p className="text-lg font-bold mb-4">本当に削除しますか?</p>
      <p className="text-sm text-gray-400 mb-4">このデッキのカードは全て削除されます。</p>
      <button 
        type="submit"
        onClick={() => deleteDeck(id)}
        className="w-full bg-white text-red-800 border border-red-500 p-3 rounded
        hover:cursor-pointer hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-700"
      >
        削除
      </button>
    </>
    
  );
}
