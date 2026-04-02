import { signOut } from "./login/action";

export default function Home() {
  return (
    <form>
      <button formAction={signOut}>ログアウト</button>
    </form>
  );
}
