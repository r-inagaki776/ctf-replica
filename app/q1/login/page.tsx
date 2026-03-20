import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser, seedIfEmpty } from "@/lib/q1/dynamo";
import Link from "next/link";

export default async function Q1LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await seedIfEmpty();
    const user = await getUser(username);

    if (user && user.password === password) {
      const session = Buffer.from(
        JSON.stringify({ username: user.username, role: "user" })
      ).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set("q1_session", session, { path: "/" });
      redirect("/q1/user");
    }

    redirect("/q1/login?error=1");
  }

  return (
    <div className="directive-panel max-w-sm mx-auto">
      <div className="directive-header">
        <h1 className="text-xl font-bold">問題01: システム認証</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">REQUIREMENT: LOGIN</p>
      </div>

      {error && (
        <div className="mb-6 p-3 border-2 border-red-600 text-red-600 font-bold text-sm text-center">
          認証失敗: ユーザー名またはパスワードが不正です。
        </div>
      )}

      <form action={login} className="space-y-4 mb-4">
        <div>
          <label className="directive-label">ユーザー名</label>
          <input
            name="username"
            type="text"
            required
            className="directive-input font-mono"
            placeholder="alice"
          />
        </div>
        <div className="mb-4">
          <label className="directive-label">パスワード</label>
          <input
            name="password"
            type="password"
            required
            className="directive-input font-mono"
            placeholder="••••••••"
          />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full directive-btn">
            ログインして続行
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-black pt-6 space-y-2 text-center text-sm font-mono mb-6">
        <p className="hint-text">- NOTE: 記録データ: alice / alice123</p>
      </div>

      <div className="text-center pt-2 mb-8">
        <Link href="/" className="text-xs font-bold underline hover:no-underline uppercase text-gray-500">
          [ 一覧へ戻る ]
        </Link>
      </div>

    </div>
  );
}
