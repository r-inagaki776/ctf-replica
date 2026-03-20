"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FlagForm({ questionId }: { questionId: string }) {
  const [flag, setFlag] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    
    const res = await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({ question: questionId, flag }),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await res.json();
    if (data.success) {
      router.push(data.redirect);
    } else {
      setError(true);
    }
  }

  return (
    <div className="mt-12 border-t-2 border-black pt-8 pb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <label className="directive-label mb-1">回答送信 / SUBMIT FLAG</label>
          <div className="text-xs text-gray-500 mb-2">
            対象問題: {questionId.toUpperCase()}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 bg-black text-white px-3 py-2 text-sm font-bold tracking-widest uppercase">
          [!] 不正解: 提出されたFLAGは無効です。
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={flag} 
          onChange={e => setFlag(e.target.value)} 
          placeholder="INDEX{...}" 
          className="directive-input flex-1 font-mono uppercase bg-gray-50"
          required
        />
        <button type="submit" className="directive-btn break-keep min-w-max">
          解答を提出
        </button>
      </form>
    </div>
  );
}
