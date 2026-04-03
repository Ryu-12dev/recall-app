import Image from "next/image";
import { signInWithGoogle } from "./action";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <div className="border border-gray-200 rounded-xl p-15 shadow-xl text-center bg-white">
        <header className="flex items-center justify-center pb-4">
          <Image src="/favicon.ico" alt="favicon" width={35} height={35} className="mr-2"/>
          <h1 className="text-black text-4xl font-bold">Recall</h1>
        </header>
        <p className="text-stone-400 mb-5">効率的な学習を手に入れましょう。</p>
        <form>
          <button className="hover:cursor-pointer hover:bg-zinc-100 border border-gray-200 px-10 py-2 rounded-4xl"
            formAction={signInWithGoogle}>
            <div className="flex items-center gap-2">
              <Image src="/google.svg" alt="google" width={25} height={25} />
              <span>Googleでログイン</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

