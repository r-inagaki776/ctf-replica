"use client";

import { useState } from "react";
import Link from "next/link";

export default function Q3LoginPage() {
  const [error, setError] = useState(false);

  async function handleLogin(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/q3/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      document.cookie = `q3_user=${data.username}; path=/`;
      document.cookie = `q3_role=${btoa(data.role)}; path=/`;
      window.location.href = "/q3/dashboard";
    } else {
      setError(true);
    }
  }

  return (
    <div className="directive-panel max-sm mx-auto">
      <div dangerouslySetInnerHTML={{ __html: "<!-- TODO: 本番前にdebugエンドポイント無効化 /api/q3/debug -->" }} />
      <div className="directive-header">
        <h1 className="text-xl font-bold">問題03: 社内ポータルシステム</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">REQUIREMENT: LOGIN CREDENTIALS</p>
      </div>

      {error && (
        <div className="mb-6 p-2 border border-red-600 text-red-600 font-bold text-sm text-center">
          ログイン失敗: アカウントが登録されていないかパスワードが一致しません。
        </div>
      )}

      <form action={handleLogin} className="space-y-4 mb-4">
        <div>
          <label className="directive-label">ユーザID</label>
          <input name="username" type="text" required className="directive-input font-mono" placeholder="tanaka" />
        </div>
        <div className="mb-4">
          <label className="directive-label">パスワード</label>
          <input name="password" type="password" required className="directive-input font-mono block" placeholder="••••••••" />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full directive-btn">認証して入室</button>
        </div>
      </form>

      <div className="mt-8 border-t border-black pt-6 space-y-2 font-mono text-sm mb-6">
        <p className="hint-text">- NOTE: 攻撃者はまず、ターゲットの情報を収集します。Webページの「見えない部分」も確認しましょう。</p>
      </div>

      <div className="text-center pt-2 mb-8">
        <Link href="/" className="text-xs font-bold underline hover:no-underline uppercase text-gray-500">
          [ 一覧へ戻る ]
        </Link>
      </div>
    </div>
  );
}
