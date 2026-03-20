import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import FlagForm from "@/components/FlagForm";
import DocumentViewer from "@/components/DocumentViewer";

type FileRecord = {
  id: string;
  filename: string;
  display_name: string;
  content: string;
  required_role: string;
};

/* ダッシュボードに表示するファイル一覧（IDORで隠しIDにアクセスするため、7は含まない） */
const VISIBLE_FILES: FileRecord[] = [
  {
    id: "1",
    filename: "report_2026_q1.txt",
    display_name: "2026年Q1レポート",
    content: "Q1の売上は順調に推移しています。次期計画に向けて投資を強化する予定です。",
    required_role: "user",
  },
  {
    id: "2",
    filename: "meeting_notes.txt",
    display_name: "第1回 部門長会議メモ (社外秘)",
    content:
      "議事録：\n１．全従業員は情報セキュリティ研修を年1回受講すること。\n２．ファイルサーバーのダウンロード機能（/api/q3/download?file=ファイル名）が運用開始。\n　　格納ディレクトリは documents/ 配下。\n３．アクセス権限の見直しを実施予定。\n\n[出席者名簿]\ntanaka, sato, suzuki, takahashi, ito, watanabe, kato",
    required_role: "admin",
  },
  {
    id: "3",
    filename: "project_plan.txt",
    display_name: "次期システム要件定義書",
    content:
      "セキュリティ要件定義：\nファイルAPIは連番IDでアクセスされる設計だが、認可チェックが不十分な箇所がある。\n内部監査チームの報告書（ID: 7）は一般一覧には表示されないが、APIレベルでの制限は未実装。",
    required_role: "admin",
  },
];

export default async function Q3DashboardPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("q3_user");
  const roleCookie = cookieStore.get("q3_role");

  if (!userCookie) {
    redirect("/q3/login");
  }

  let role = "user";
  if (roleCookie) {
    try {
      const decoded = Buffer.from(roleCookie.value, "base64").toString("utf-8");
      // デコード結果が期待される文字列（admin, user）である場合のみ適用
      if (decoded === "admin" || decoded === "user") {
        role = decoded;
      } else {
        // デコード結果が不正な場合、以前のクッキーの値がそのまま入っている可能性があるため、
        // 文字化けを避けて raw 値を表示するか、または user に戻す
        role = (roleCookie.value === "admin" || roleCookie.value === "user") 
          ? roleCookie.value 
          : "unknown";
      }
    } catch {
      role = "user";
    }
  }

  /* Cookie改竄: role がadminならadminファイルも表示される */
  const files = VISIBLE_FILES.filter(
    (f) => f.required_role === "user" || role === "admin"
  );

  return (
    <div className="directive-panel max-w-3xl mx-auto">
      <div className="directive-header flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-bold">問題03: 共有ファイルハブ</h1>
          <p className="text-xs mt-2 text-gray-500 font-bold">ACCESS GRANTED. VIEWING SHARED DIR.</p>
        </div>
        <div className="bg-black text-white px-3 py-1 font-bold text-sm font-mono tracking-widest">
          [ USER: {userCookie.value.toUpperCase()} | ROLE: {role.toUpperCase()} ]
        </div>
      </div>

      {/* ファイルテーブル */}
      <DocumentViewer files={files} role={role} questionId="q3" />

      {role !== "admin" && (
        <div className="text-xs text-gray-400 font-mono text-center mb-4">
          ※ 一部のファイルは管理者権限が必要です。
        </div>
      )}

      <div className="text-center pt-2 mb-8 mt-8">
        <Link href="/" className="text-xs font-bold underline hover:no-underline uppercase text-gray-500">
          [ セッションを終了して一覧へ ]
        </Link>
      </div>

      <FlagForm questionId="q3" />
    </div>
  );
}
