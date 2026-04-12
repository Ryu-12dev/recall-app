import { deleteDeck } from "./action";

export default function DeleteDeckModal({ id, onClose }: { id: string, onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className=" mb-4">
          <p className="text-lg font-bold">
            本当に削除しますか？
          </p>
        </header>
        <p className="text-sm text-gray-400 mb-4">
          このデッキのカードは全て削除されます。
        </p>
        <button 
          type="submit"
          onClick={() => deleteDeck(id)}
          className="w-full bg-white text-red-800 border border-red-500 p-3 rounded
          hover:cursor-pointer hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-700"
        >
          削除
        </button>
      </div>
    </div>
  )
}
