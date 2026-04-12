import { editDeck } from "../action";

export default function EditDeckModal({ id, onClose }: { id: string, onClose: () => void }) {
  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    if (!name.trim()) {
      return;
    }
    const result = await editDeck(id, name);
    onClose();
  }
  return (
    <>
      <p className="text-lg font-bold mb-4">編集</p>
      <form action={handleSubmit}>
        <input 
          type="text"
          name="name"
          placeholder="デッキ名"
          autoComplete="off"
          autoFocus={true}
          className="w-full border p-2 mb-4 rounded"
        />
        <button 
          type="submit"
          className="w-full bg-white text-red-800 border border-red-500 p-3 rounded
          hover:cursor-pointer hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-700"
        >
          更新
        </button>
      </form>
    </>
    
  );
}
