"use client";
import { useSyncExternalStore } from "react";

type BrowserKind = "android" | "other" | "regular";

const subscribe = () => () => undefined;
const getServerSnapshot = (): BrowserKind => "regular";
const getBrowserSnapshot = (): BrowserKind => {
  const ua = navigator.userAgent;
  const isInApp = /Twitter|Instagram|Line|FBAN/i.test(ua);
  if (!isInApp) return "regular";
  return /Android/i.test(ua) ? "android" : "other";
};

export default function InAppBrowserBanner() {
  const browserKind = useSyncExternalStore(
    subscribe,
    getBrowserSnapshot,
    getServerSnapshot
  );

  if (browserKind === "regular") return null;

  return (
    <div className="mb-5 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-left">
      <p className="font-semibold mb-1">⚠️ アプリ内ブラウザでは<br />Googleログインが使えません</p>
      <p className="text-yellow-700">
        {browserKind === "android"
          ? <>メニューから「ブラウザで開く」を選択してください。</>
          : <>下部のアドレスバー横の <span className="font-mono">⋮</span> →「ブラウザで開く」からアクセスしてください。</>
        }
      </p>
    </div>
  );
}
