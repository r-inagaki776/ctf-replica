import Link from "next/link";
import { redirect } from "next/navigation";

const EXPLANATIONS: Record<string, { title: string; content: string }> = {
  q1: {
    title: "問題01: IDOR / Cookie(セッション)改竄",
    content: "認証を管理している Cookie（q1_session）の内容が、単にBase64などでエンコードされた固定のJSON文字列になっている脆弱性です。この文字列をデコードすると、ユーザー情報や権限（role: 'user' など）が見えます。この role を 'admin' 等に書き換えて再びエンコードし直すことで、管理者特権を獲得し、隠された情報を閲覧できました。",
  },
  q2: {
    title: "問題02: OS Command Injection",
    content: "ユーザーから受け取った入力値を、裏側で実行しているOSのコマンド（nslookup等）に安全でない形で連結して引き渡す脆弱性です。例えば入力値にセミコロン(;)やパイプ(|)等を加えることで元のコマンド実行を強制終了させ、攻撃者自身が意図した別コマンドを注入(Injection)し、サーバー固有の機密ファイル（/tmp/q2_flag.txt）などを閲覧できます。",
  },
  q3: {
    title: "問題03: 複合脆弱性チェーン (5段階攻撃)",
    content: `この問題は5つの脆弱性を連鎖させて最終フラグに到達するシナリオです。

【STEP 1: Information Disclosure（情報漏洩）】
ログインページのHTMLソースコードを確認すると、コメントにデバッグ用エンドポイント /api/q3/debug が記載されています。このAPIにアクセスすると、テストアカウント情報（tanaka / tanaka123）とSQLフィルタリング未実装のヒントが得られます。

【STEP 2: SQL Injection（SQLインジェクション）】
ログインフォームに admin / ' OR 1=1 -- を入力すると、パスワード検証がバイパスされ、admin権限でログインできます。

【STEP 3: Cookie Tampering（Cookie改竄）】
しかしログイン後のCookieは q3_role=dXNlcg== (userのBase64エンコード) のままです。ブラウザのDevToolsでこの値を admin のBase64である YWRtaW4= に変更してページをリロードすると、管理者限定ファイル（会議メモ、要件定義書）が表示されます。

【STEP 4: IDOR（安全でない直接オブジェクト参照）】
要件定義書に「監査レポート（ID: 7）がAPI制限未実装」と記載されています。/api/q3/files/7 に直接アクセスすると、ダッシュボードには表示されない極秘監査レポートが読め、ダウンロードAPIのパストラバーサル脆弱性と検証コマンドが記載されています。

【STEP 5: Path Traversal（ディレクトリトラバーサル）】
/api/q3/download?file=../secret/flag.txt にアクセスすると、ドキュメントルート外のファイルを読み取れます。ここに最終フラグ INDEX{ch41n3d_vuln_m4st3r} が格納されています。`,
  },
};

export default async function ExplanationPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const exp = q && EXPLANATIONS[q] ? EXPLANATIONS[q] : null;

  if (!exp) {
    redirect("/");
  }

  return (
    <div className="directive-panel max-w-2xl mx-auto">
      <div className="directive-header">
        <h1 className="text-xl font-bold">正解 / 解説</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">SYSTEM: FLAG ACCEPTED</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 font-mono">{exp.title}</h2>
        <div className="border border-black p-6 bg-gray-50 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {exp.content}
        </div>
      </div>

      <div className="mt-12 text-center pt-8 border-t border-black">
        <Link href="/" className="directive-btn w-full md:w-auto inline-block">
          トップ（問題一覧）へ戻る
        </Link>
      </div>
    </div>
  );
}
