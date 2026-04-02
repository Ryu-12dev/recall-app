import { signInWithGoogle } from "./action";

export default function LoginPage() {
  return (
    <div className="border rounded-md">
      <h1 className="text-teal-600 text-5xl font-bold">Recall</h1>
      <form>
        <button formAction={signInWithGoogle}>ログイン</button>
      </form>
    </div>
  );
}

