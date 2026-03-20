"use client";

import { useState } from "react";
import Link from "next/link";
import FlagForm from "@/components/FlagForm";

export default function Q2Page() {
  const [host, setHost] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDiagnose(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("ネットワーク診断を開始しました...\n");

    try {
      const res = await fetch("/api/q2/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      });

      const data = await res.json();
      if (data.output) {
        setOutput((prev) => prev + data.output);
      } else if (data.error) {
        setOutput((prev) => prev + `重大なエラー: ${data.error}`);
      }
    } catch {
      setOutput((prev) => prev + "重大なエラー: バックエンドへの接続が失われました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="directive-panel max-w-2xl mx-auto">
      <div className="directive-header">
        <h1 className="text-xl font-bold">問題02: EC2 ユーザー検索</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">OBJECTIVE: EC2 USER LOOKUP</p>
      </div>

      <form onSubmit={handleDiagnose} className="mb-4">
        <div className="mb-4">
          <label className="directive-label">検索ユーザー ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
              className="flex-1 directive-input font-mono"
              placeholder="ec2-user"
            />
            <button
              type="submit"
              disabled={loading}
              className="directive-btn min-w-[120px]"
            >
              {loading ? "検索中..." : "検索(SEARCH)"}
            </button>
          </div>
        </div>
      </form>

      <div className="border border-black bg-[#111] text-[#0f0] p-4 min-h-[200px] max-h-[400px] overflow-y-auto mb-6">
        <div className="text-[10px] text-gray-500 mb-2 font-bold select-none font-sans uppercase">
          &gt;_ 検索結果
        </div>
        <pre className="text-xs whitespace-pre-wrap break-all font-mono leading-relaxed">
          {output || "待機中..."}
        </pre>
      </div>

      <div className="mt-8 border-t border-black pt-6 space-y-2 font-mono text-sm mb-6">
        <p className="hint-text">- NOTE: まるでOSみたいだぁ。</p>
      </div>

      <div className="text-center pt-2 mb-8">
        <Link href="/" className="text-xs font-bold underline hover:no-underline uppercase text-gray-500">
          [ 一覧へ戻る ]
        </Link>
      </div>

      <FlagForm questionId="q2" />
    </div>
  );
}
