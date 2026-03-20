import { NextRequest, NextResponse } from "next/server";

/**
 * Q3 脆弱性4: IDOR (Insecure Direct Object Reference)
 * ファイルIDを変えるだけで本来見えないファイルにアクセスできる。
 * ダッシュボードには表示されないID=7のファイルに直接アクセス可能。
 */

const FILES: Record<string, { filename: string; display_name: string; content: string; required_role: string }> = {
  "1": {
    filename: "report_2026_q1.txt",
    display_name: "2026年Q1レポート",
    content: "Q1の売上は順調に推移しています。次期計画に向けて投資を強化する予定です。",
    required_role: "user",
  },
  "2": {
    filename: "meeting_notes.txt",
    display_name: "第1回 部門長会議メモ (社外秘)",
    content:
      "議事録：\n１．全従業員は情報セキュリティ研修を年1回受講すること。\n２．ファイルサーバーのダウンロード機能（/api/q3/download?file=ファイル名）が運用開始。\n　　格納ディレクトリは documents/ 配下。\n３．アクセス権限の見直しを実施予定。\n\n[出席者名簿]\ntanaka, sato, suzuki, takahashi, ito, watanabe, kato",
    required_role: "admin",
  },
  "3": {
    filename: "project_plan.txt",
    display_name: "次期システム要件定義書",
    content:
      "セキュリティ要件定義：\nファイルAPIは連番IDでアクセスされる設計だが、認可チェックが不十分な箇所がある。\n内部監査チームの報告書（ID: 7）は一般一覧には表示されないが、APIレベルでの制限は未実装。",
    required_role: "admin",
  },
  "7": {
    filename: "internal_audit_confidential.txt",
    display_name: "内部監査レポート (極秘)",
    content:
      "【内部監査報告 - 極秘】\n\nダウンロードAPI（/api/q3/download）にパストラバーサル脆弱性を確認。\nドキュメントルート（documents/）の外にある機密ファイルへのアクセスが可能。\n\n検証コマンド例:\n  /api/q3/download?file=../secret/flag.txt\n\n早急にパス正規化処理を実装すること。",
    required_role: "internal",
  },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const file = FILES[id];
  if (!file) {
    return NextResponse.json({ error: "file_not_found" }, { status: 404 });
  }

  // 脆弱性: 認可チェックなし。IDさえ分かれば誰でもアクセス可能。
  return NextResponse.json({
    id,
    filename: file.filename,
    display_name: file.display_name,
    content: file.content,
  });
}
