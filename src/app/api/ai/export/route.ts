import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { generateExportListing } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ message: "Silakan masuk terlebih dahulu." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const namaProduk = body?.namaProduk?.trim();
  if (!namaProduk) {
    return NextResponse.json({ message: "Nama produk diperlukan." }, { status: 400 });
  }

  const result = await generateExportListing({ namaProduk, detail: body?.detail?.trim() });
  return NextResponse.json(result);
}
