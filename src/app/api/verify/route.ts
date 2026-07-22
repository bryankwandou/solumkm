import { NextRequest, NextResponse } from "next/server";
import { verifyMemo } from "@/lib/solana";

// Public, no auth: anyone can verify an anchor straight against devnet.
// Reading a transaction back from the chain can take a moment on cold RPC.
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const signature = new URL(request.url).searchParams.get("signature")?.trim();
  if (!signature) {
    return NextResponse.json({ message: "Signature diperlukan." }, { status: 400 });
  }

  const result = await verifyMemo(signature);
  if (!result.ok) {
    return NextResponse.json({ verified: false, reason: result.reason }, { status: 200 });
  }

  return NextResponse.json({ verified: true, ...result });
}
