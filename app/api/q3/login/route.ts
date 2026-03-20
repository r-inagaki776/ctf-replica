import { NextRequest, NextResponse } from "next/server";
import { getUser, seedIfEmpty } from "@/lib/q3/dynamo";

/**
 * Q3 脆弱性2: SQL Injection
 * 意図的なSQLインジェクション脆弱性の「振る舞い」をDynamoDB上で再現する。
 *
 * Classic SQLi: username = "admin" / password = "' OR 1=1 --"
 * → パスワードを検証せずにadminユーザーを返す振る舞いをシミュレート。
 *
 * 実際にはSQLを実行していないが、特定ペイロードを検知してバイパスを許可する。
 */
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  await seedIfEmpty();

  // SQLインジェクションペイロードを検知（ ' OR 系 ）
  const isSqliPayload = /'\s*or\s+\d+=\d+/i.test(String(password)) ||
                        /'\s*or\s+'[\w]+'='[\w]+/i.test(String(password));

  let user;

  if (isSqliPayload) {
    // SQLiが成功した場合：パスワード認証をバイパスするが、
    // 古いクエリの不具合（JOIN失敗等）をエミュレートし、役職情報は一律 "user" として返却される。
    // （これにより、次のステップ「Cookie書き換え」を必須にさせる）
    user = await getUser("admin");
    if (user) {
      user.role = "user"; 
    }
  } else {
    user = await getUser(String(username));
    if (!user || user.password !== String(password)) {
      return NextResponse.json({ success: false });
    }
  }

  if (!user) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({
    success: true,
    username: user.username,
    role: user.role,
  });
}
