import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { ensureSchema, sql } from "@/lib/db";
import { anchorFingerprint } from "@/lib/solana";

// Anchoring writes to devnet, which can take a few seconds — force Node runtime
// and a longer budget so the confirmation isn't cut off.
export const runtime = "nodejs";
export const maxDuration = 30;

async function ensureAnchorTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS report_anchors (
      id UUID PRIMARY KEY,
      owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      fingerprint TEXT NOT NULL,
      signature TEXT NOT NULL,
      cluster TEXT NOT NULL DEFAULT 'devnet',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

// Return the stored anchor for a given fingerprint, if this owner already
// anchored exactly this report — lets the UI show "already verified on-chain".
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });

  const fingerprint = new URL(request.url).searchParams.get("fingerprint");
  if (!fingerprint) return NextResponse.json({ anchor: null });

  await ensureSchema();
  await ensureAnchorTable();
  const rows = await sql<{ signature: string; cluster: string; created_at: string }>`
    SELECT signature, cluster, created_at FROM report_anchors
    WHERE owner_id = ${auth.userId} AND fingerprint = ${fingerprint}
    ORDER BY created_at DESC LIMIT 1
  `;

  const anchor = rows[0]
    ? {
        signature: rows[0].signature,
        cluster: rows[0].cluster,
        explorerUrl: `https://explorer.solana.com/tx/${rows[0].signature}?cluster=${rows[0].cluster}`,
        createdAt: rows[0].created_at,
      }
    : null;

  return NextResponse.json({ anchor });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const fingerprint = body?.fingerprint?.trim();
  if (!fingerprint) {
    return NextResponse.json({ message: "Sidik digital laporan diperlukan." }, { status: 400 });
  }

  await ensureSchema();
  await ensureAnchorTable();

  // Each anchor spends a network fee from the shared devnet wallet, so cap how
  // many times one account can anchor per day. This stops a single registrant
  // from draining the wallet and breaking the on-chain feature for everyone.
  const DAILY_ANCHOR_LIMIT = 20;
  const recent = await sql<{ n: number }>`
    SELECT COUNT(*)::int AS n FROM report_anchors
    WHERE owner_id = ${auth.userId} AND created_at > now() - interval '24 hours'
  `;
  if ((recent[0]?.n ?? 0) >= DAILY_ANCHOR_LIMIT) {
    return NextResponse.json(
      { message: "Batas penguncian harian tercapai. Coba lagi besok." },
      { status: 429 },
    );
  }

  const result = await anchorFingerprint(fingerprint);
  if (!result.ok) {
    return NextResponse.json({ message: result.reason }, { status: 502 });
  }

  await sql`
    INSERT INTO report_anchors (id, owner_id, fingerprint, signature, cluster)
    VALUES (${crypto.randomUUID()}, ${auth.userId}, ${fingerprint}, ${result.signature}, ${result.cluster})
  `;

  return NextResponse.json({
    signature: result.signature,
    cluster: result.cluster,
    explorerUrl: result.explorerUrl,
  });
}
