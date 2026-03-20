import { NextResponse } from "next/server";

/**
 * Q3 脆弱性1: Information Disclosure
 * 本番環境に残されたデバッグエンドポイント。
 * ログインページのHTMLコメントからこのパスを発見できる。
 */
export async function GET() {
  return NextResponse.json({
    status: "debug_mode_active",
    test_account: { username: "tanaka", password: "tanaka123" },
    note: "一般ポータルのログインクエリにはSQLフィルタリングが未実装です。",
    db_info: { users_table: "active", files_table: "active" },
  });
}
