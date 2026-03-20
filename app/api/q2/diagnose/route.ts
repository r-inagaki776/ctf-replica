import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";

/**
 * Q2 EC2ユーザー検索 API
 * 意図的なOS Command Injection脆弱性。
 * ユーザー入力をサニタイズせず id コマンドに渡す。
 *
 * 正常利用: root → uid=0(root) gid=0(root) ...
 * 攻撃例:   root; ls /tmp        → ユーザー情報 + ディレクトリ一覧
 *           root; cat /tmp/q2_flag.txt → ユーザー情報 + フラグ漏洩
 */

function ensureFlagFile() {
  if (process.env.WINDIR) return;
  const flagPath = "/tmp/q2_flag.txt";
  if (!fs.existsSync(flagPath)) {
    const content = process.env.Q2_FLAG_FILE_CONTENT ?? "INDEX{0s_cmd_1nj3ct10n_pwn3d}";
    fs.writeFileSync(flagPath, content, "utf-8");
  }
}

export async function POST(request: NextRequest) {
  ensureFlagFile();

  try {
    const { host: input } = await request.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "ユーザーIDを入力してください。" },
        { status: 400 }
      );
    }

    // OS Command Injection: ユーザー入力をサニタイズせず id コマンドに埋め込む
    // id <ユーザーID> は存在するユーザーの情報を返し、存在しない場合はエラーを返す
    // セミコロン(;)やパイプ(|)で追加コマンドを注入可能
    const command = process.env.WINDIR
      ? `echo Checking: ${input}`
      : `id ${input}`;

    const result = execSync(command, {
      encoding: "utf-8",
      timeout: 10000,
    });

    return NextResponse.json({ output: `[USER FOUND]\n${result.trim()}` });
  } catch (err: unknown) {
    const error = err as {
      stdout?: string;
      stderr?: string;
      message?: string;
      status?: number;
    };
    // id コマンドがユーザー未発見で exit code 1 を返した場合でも
    // 注入されたコマンドのstdoutは取得可能
    if (error.stdout && error.stdout.trim().length > 0) {
      return NextResponse.json({ output: error.stdout });
    }
    // id: '<user>': no such user のようなメッセージ
    if (error.stderr && error.stderr.includes("no such user")) {
      return NextResponse.json({ output: `[USER NOT FOUND]\n指定されたユーザーID は登録されていません。` });
    }
    if (error.stderr) {
      return NextResponse.json({ output: error.stderr });
    }
    return NextResponse.json({ output: `[USER NOT FOUND]\n指定されたユーザーID は登録されていません。` });
  }
}
