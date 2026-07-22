import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { generateMarketingContent } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const authPayload = await authenticateRequest(request);
  if (!authPayload) {
    return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.namaProduk) {
    return NextResponse.json(
      { message: "Nama produk wajib diisi." },
      { status: 400 },
    );
  }

  const namaProduk = String(body.namaProduk).trim();
  const platform = (["instagram", "whatsapp", "shopee", "tokopedia"].includes(body.platform)
    ? body.platform
    : "instagram") as "instagram" | "whatsapp" | "shopee" | "tokopedia";
  const tone = (["formal", "santai", "semangat"].includes(body.tone) ? body.tone : "santai") as
    | "formal"
    | "santai"
    | "semangat";

  try {
    const result = await generateMarketingContent({ namaProduk, platform, tone });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Gagal menghasilkan konten. Coba lagi nanti." },
      { status: 500 },
    );
  }
}
