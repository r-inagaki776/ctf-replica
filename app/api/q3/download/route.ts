import { NextRequest, NextResponse } from "next/server";
import path from "path";

/**
 * Q3 脆弱性5: Path Traversal (ディレクトリトラバーサル)
 * ファイル名パラメータの正規化・検証が不十分で、
 * ../secret/flag.txt のようなパスで仮想ディレクトリ外のファイルを読み取れる。
 */

const VIRTUAL_FS: Record<string, string> = {
  "documents/report_2026_q1.txt":
    "Q1の売上は順調に推移しています。次期計画に向けて投資を強化する予定です。",
  "documents/meeting_notes.txt":
    "議事録：\n１．全従業員は情報セキュリティ研修を年1回受講すること。\n２．ファイルサーバーのダウンロード機能が運用開始。",
  "documents/project_plan.txt":
    "セキュリティ要件定義：\nファイルAPIは連番IDでアクセスされる設計。",
  "secret/flag.txt": "INDEX{ch41n3d_vuln_m4st3r}",
};

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "file parameter is required" },
      { status: 400 }
    );
  }

  // 脆弱性: ユーザーの入力をそのまま documents/ に結合し、
  // path.normalize で ../ を解決してしまうため、documents/ 外のファイルにアクセス可能
  const requestedPath = path.normalize(`documents/${file}`).replace(/\\/g, "/");

  const content = VIRTUAL_FS[requestedPath];

  if (!content) {
    return NextResponse.json({ error: "file_not_found" }, { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `inline; filename="${path.basename(file)}"`,
    },
  });
}
