import { NextResponse } from "next/server";

const FLAGS: Record<string, string> = {
  q1: "INDEX{c00k13_s3ss10n_f0rg3ry}",
  q2: "INDEX{0s_cmd_1nj3ct10n_pwn3d}",
  q3: "INDEX{ch41n3d_vuln_m4st3r}",
};

export async function POST(req: Request) {
  try {
    const { question, flag } = await req.json();
    const targetQ = question as keyof typeof FLAGS;
    
    if (FLAGS[targetQ] === flag) {
      return NextResponse.json({ success: true, redirect: `/explanation?q=${question}` });
    }
    return NextResponse.json({ success: false });
  } catch {
    return NextResponse.json({ success: false });
  }
}
