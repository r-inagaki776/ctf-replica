import Link from "next/link";

const directives = [
  {
    id: "q1",
    title: "問題01",
    desc: "🍪",
    href: "/q1/login",
  },
  {
    id: "q2",
    title: "問題02",
    desc: "サーバーにコマンドを送るツール…？",
    href: "/q2",
  },
  {
    id: "q3",
    title: "問題03",
    desc: "穴がいくつもあるらしい",
    href: "/q3/login",
  },
];

export default function Home() {
  return (
    <div className="directive-panel">
      <div className="directive-header">
        <h1 className="text-2xl font-bold">問題一覧</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">STATUS: {directives.length} QUESTIONS</p>
      </div>

      <div className="space-y-4 mb-4">
        {directives.map((d) => (
          <div key={d.id} className="border border-black p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg">{d.title}</span>
              </div>
              <div className="text-sm font-mono font-bold mt-1">{d.desc}</div>
            </div>
            <Link href={d.href} className="directive-btn-outline text-xs text-center whitespace-nowrap self-center">
              挑戦する
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-mono pt-4 border-t border-black border-dashed">
        Please complete all questions.
      </div>
    </div>
  );
}
