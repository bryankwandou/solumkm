import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { ensureSchema, sql } from "@/lib/db";
import { generateInsights } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const authPayload = await authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  await ensureSchema();

  // Latest 100 transactions
  const transactions = await sql`
    SELECT jenis, jumlah, kategori, tanggal
    FROM transactions
    WHERE owner_id = ${authPayload.userId}
    ORDER BY tanggal DESC, created_at DESC
    LIMIT 100
  `;

  const body = await request.json().catch(() => ({}));
  const periode = body.periode || "30 hari terakhir";

  const mapped = transactions.map((t) => ({
    jenis: t.jenis as string,
    jumlah: t.jumlah as number,
    kategori: t.kategori as string,
    tanggal: String(t.tanggal).slice(0, 10),
  }));

  try {
    const insights = await generateInsights({ transactions: mapped, periode });
    return NextResponse.json(insights);
  } catch {
    // Fallback with computed data
    const pemasukan = mapped
      .filter((t) => t.jenis === "pemasukan")
      .reduce((sum, t) => sum + t.jumlah, 0);
    const pengeluaran = mapped
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((sum, t) => sum + t.jumlah, 0);

    const kategoriCounts: Record<string, number> = {};
    mapped
      .filter((t) => t.jenis === "pemasukan")
      .forEach((t) => {
        kategoriCounts[t.kategori] = (kategoriCounts[t.kategori] || 0) + t.jumlah;
      });

    const kategoriTerlaris = Object.entries(kategoriCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Umum";

    return NextResponse.json({
      ringkasan: `Total pemasukan: Rp${pemasukan.toLocaleString("id-ID")}, pengeluaran: Rp${pengeluaran.toLocaleString("id-ID")}.`,
      totalPemasukan: pemasukan,
      totalPengeluaran: pengeluaran,
      labaBersih: pemasukan - pengeluaran,
      kategoriTerlaris,
      rekomendasi: ["Catat transaksi setiap hari", "Pisahkan keuangan pribadi dan bisnis", "Evaluasi produk terlaris tiap bulan"],
      grafikSummary: mapped.length < 5 ? "Data masih terbatas" : "Ringkasan berdasarkan data yang tersedia",
    });
  }
}
