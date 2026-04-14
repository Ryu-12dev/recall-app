
export default function AddCardModal({ id }: { id: string }) {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">カード追加</h2>
      <div>
        <form
          className="flex flex-col gap-4"
        >
          <div>
            <p className="text-base mb-2">表</p>
            <textarea 
              ref={el => el?.focus()}
              className="border rounded-xl text-3xl" />
          </div>
          <div>
            <p className="text-base mb-2">裏</p>
            <textarea className="border rounded-xl text-3xl" />
          </div>
        </form>
      </div>
    </>
  );
}
