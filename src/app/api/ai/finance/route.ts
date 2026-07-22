import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { ensureSchema, sql } from "@/lib/db";
import { generateFinanceRecord } from "@/lib/ai";

export async function GET(request: NextRequest) {
  const authPayload = await authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  await ensureSchema();
  const transactions = await sql`
    SELECT id, jenis, jumlah, kategori, keterangan, tanggal, created_at
    FROM transactions
    WHERE owner_id = ${authPayload.userId}
    ORDER BY tanggal DESC, created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ transactions });
}

export async function POST(request: NextRequest) {
  const authPayload = await authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = body?.text?.trim();
  const manual = body?.manual;
  const preview = body?.preview === true;

  if (!text && !manual) {
    return NextResponse.json(
      { message: "Isi teks transaksi atau data manual." },
      { status: 400 },
    );
  }

  // Preview mode: run the AI parse and return the draft WITHOUT saving, so the
  // owner can check (and fix) what the AI understood before it hits the books.
  if (preview && text) {
    const draft = await generateFinanceRecord({ text });
    return NextResponse.json({ draft });
  }

  try {
    await ensureSchema();

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        jenis TEXT NOT NULL,
        jumlah INTEGER NOT NULL DEFAULT 0,
        kategori TEXT NOT NULL DEFAULT 'lainnya',
        keterangan TEXT NOT NULL DEFAULT '',
        tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    let record: { jenis: string; jumlah: number; kategori: string; keterangan: string; tanggal: string };

    if (text) {
      const aiResult = await generateFinanceRecord({ text });
      record = aiResult;
    } else {
      record = {
        jenis: manual.jenis || "pemasukan",
        jumlah: Number(manual.jumlah) || 0,
        kategori: manual.kategori || "lainnya",
        keterangan: manual.keterangan || "",
        tanggal: manual.tanggal || new Date().toISOString().slice(0, 10),
      };
    }

    const id = crypto.randomUUID();
    const rows = await sql`
      INSERT INTO transactions (id, jenis, jumlah, kategori, keterangan, tanggal, owner_id)
      VALUES (${id}, ${record.jenis}, ${record.jumlah}, ${record.kategori}, ${record.keterangan}, ${record.tanggal}, ${authPayload.userId})
      RETURNING id, jenis, jumlah, kategori, keterangan, tanggal, created_at
    `;

    return NextResponse.json({ message: "Transaksi berhasil dicatat", transaction: rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Gagal mencatat transaksi. Coba lagi nanti." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authPayload = await authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID transaksi diperlukan." }, { status: 400 });
  }

  await ensureSchema();
  const rows = await sql`
    DELETE FROM transactions
    WHERE id = ${id} AND owner_id = ${authPayload.userId}
    RETURNING id
  `;

  if (!rows[0]) {
    return NextResponse.json({ message: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ message: "Transaksi berhasil dihapus." });
}
