import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser, seedIfEmpty } from "@/lib/q1/dynamo";
import Link from "next/link";
import FlagForm from "@/components/FlagForm";

export default async function Q1UserPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("q1_session");

  if (!sessionCookie) {
    redirect("/q1/login");
  }

  let sessionData: { username: string; role: string };
  try {
    sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );
  } catch {
    redirect("/q1/login");
    return;
  }

  await seedIfEmpty();
  const user = await getUser(sessionData.username);

  if (!user) {
    notFound();
  }

  const showFlag = sessionData.role === "admin";

  return (
    <div className="directive-panel max-w-md mx-auto">
      <div className="directive-header">
        <h1 className="text-xl font-bold">問題01: ユーザープロファイル</h1>
        <p className="text-xs mt-2 text-gray-500 font-bold">STATUS: CONFIDENTIAL</p>
      </div>

      <div className="space-y-1 mb-8 font-mono">
        <div className="flex justify-between border-b border-gray-300 py-2">
          <span className="text-xs font-bold">ユーザー名:</span>
          <span className="text-sm font-bold">{user.username}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 py-2">
          <span className="text-xs font-bold">送信先:</span>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 py-2">
          <span className="text-xs font-bold">権限レベル:</span>
          <span className={`text-sm font-bold ${sessionData.role === "admin" ? "bg-black text-white px-2" : ""}`}>
            {sessionData.role.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="border border-black p-4 bg-gray-50 text-center font-mono">
        <div className="text-xs font-bold mb-2">【 添付フラグデータ 】</div>
        <div className={`text-sm break-all ${showFlag ? "font-bold text-black" : "italic text-gray-500"}`}>
          {showFlag ? (user.flag ?? "—") : "閲覧制限: ADMIN権限が必要です"}
        </div>
      </div>



      <div className="text-center pt-2 mb-8">
        <Link href="/" className="text-xs font-bold underline hover:no-underline uppercase text-gray-500">
          [ セッションを終了して一覧へ ]
        </Link>
      </div>

      <FlagForm questionId="q1" />
    </div>
  );
}
