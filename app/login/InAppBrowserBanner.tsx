"use client";
import { useEffect, useState } from "react";

export default function InAppBrowserBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isInApp = /Twitter|Instagram|Line|FBAN/i.test(ua);
    if (isInApp) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="mb-5 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-left">
      <p className="font-semibold mb-1">⚠️ アプリ内ブラウザでは<br />Googleログインが使えません</p>
      <p className="text-yellow-700">
        右上の <span className="font-mono">⋮</span> →「ブラウザで開く」から<br />
        Safari / Chrome でアクセスしてください。
      </p>
    </div>
  );
}
