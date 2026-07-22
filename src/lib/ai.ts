import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will return fallback responses.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" }) ?? null;

const SYSTEM_MARKETING = `Kamu adalah asisten pemasaran digital untuk pelaku UMKM Indonesia.
Tugasmu membantu menghasilkan konten pemasaran yang menarik, sederhana, dan mudah dipahami.
Selalu gunakan Bahasa Indonesia yang friendly, tidak bertele-tele, dan menggunakan gaya bahasa anak muda.
Hasilkan output dalam format JSON yang bersih.`;

const SYSTEM_FINANCE = `Kamu adalah asisten keuangan pintar untuk pelaku UMKM Indonesia.
Tugasmu membantu mencatat transaksi, mengkategorikan pengeluaran/pemasukan, dan membuat laporan sederhana.
Pahami input bahasa alami dalam Bahasa Indonesia, seperti "jual nasi goreng 5 piring dapat 75 ribu".
Selalu output dalam format JSON yang valid.`;

const SYSTEM_INSIGHTS = `Kamu adalah analis bisnis untuk UMKM Indonesia.
Tugasmu menganalisis data penjualan dan memberikan wawasan sederhana yang bisa langsung dipahami.
Gunakan Bahasa Indonesia, berikan rekomendasi praktis, dan selalu output JSON.`;

export type AIMarketingInput = {
  namaProduk: string;
  platform: "instagram" | "whatsapp" | "shopee" | "tokopedia";
  tone: "formal" | "santai" | "semangat";
};

export type AIMarketingOutput = {
  caption: string;
  hashtags: string[];
  deskripsiSingkat: string;
  ajakan: string;
};

export type AIFinanceInput = {
  text: string; // natural language input
};

export type AIFinanceOutput = {
  jenis: "pemasukan" | "pengeluaran";
  jumlah: number;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

export type AIInsightsInput = {
  transactions: {
    jenis: string;
    jumlah: number;
    kategori: string;
    tanggal: string;
  }[];
  periode: string;
};

export type AIInsightsOutput = {
  ringkasan: string;
  totalPemasukan: number;
  totalPengeluaran: number;
  labaBersih: number;
  kategoriTerlaris: string;
  rekomendasi: string[];
  grafikSummary: string;
};

async function generateContent(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!model) {
    return JSON.stringify({ error: "AI service belum dikonfigurasi (GEMINI_API_KEY tidak ada)" });
  }

  try {
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return JSON.stringify({ error: "Layanan AI sedang sibuk, coba lagi nanti." });
  }
}

function extractJson(text: string): string {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    return cleaned.slice(jsonStart, jsonEnd + 1);
  }
  return cleaned;
}

export async function generateMarketingContent(input: AIMarketingInput): Promise<AIMarketingOutput> {
  const prompt = `
Buatkan konten pemasaran untuk produk UMKM berikut:

Nama Produk: ${input.namaProduk}
Platform: ${input.platform}
Nada: ${input.tone}

Output HARUS dalam format JSON seperti ini:
{
  "caption": "caption menarik untuk ${input.platform}, maksimal 300 karakter",
  "hashtags": ["hashtag1", "hashtag2", ...maksimal 5],
  "deskripsiSingkat": "deskripsi singkat produk 2-3 kalimat",
  "ajakan": "kalimat ajakan untuk membeli"
}`;

  const raw = await generateContent(SYSTEM_MARKETING, prompt);
  try {
    return JSON.parse(extractJson(raw)) as AIMarketingOutput;
  } catch {
    return {
      caption: `✨ ${input.namaProduk} - solusi terbaik untuk kebutuhanmu! Kualitas terjamin, harga bersahabat. Yuk order sekarang!`,
      hashtags: ["#UMKMIndonesia", "#ProdukLokal", "#DukungLokal", "#JualanOnline"],
      deskripsiSingkat: `Dapatkan ${input.namaProduk} dengan kualitas terbaik dan harga yang ramah di kantong.`,
      ajakan: "Klik link di bio untuk order sekarang! 🛒",
    };
  }
}

export async function generateFinanceRecord(input: AIFinanceInput): Promise<AIFinanceOutput> {
  const prompt = `
Analisis input transaksi berikut dalam Bahasa Indonesia:
"${input.text}"

Tentukan apakah ini pemasukan atau pengeluaran, berapa jumlahnya dalam Rupiah, kategorikan, dan berikan keterangan.
Output HARUS JSON:
{
  "jenis": "pemasukan" atau "pengeluaran",
  "jumlah": angka dalam rupiah (number),
  "kategori": "makanan/minuman/jasa/fashion/kebutuhan pokok/lainnya",
  "keterangan": "deskripsi singkat transaksi",
  "tanggal": "YYYY-MM-DD (tanggal hari ini jika tidak disebutkan)"
}`;

  const raw = await generateContent(SYSTEM_FINANCE, prompt);
  try {
    const result = JSON.parse(extractJson(raw)) as AIFinanceOutput;
    result.tanggal = result.tanggal || new Date().toISOString().slice(0, 10);
    return result;
  } catch {
    return {
      jenis: "pemasukan",
      jumlah: 0,
      kategori: "lainnya",
      keterangan: input.text,
      tanggal: new Date().toISOString().slice(0, 10),
    };
  }
}

export async function generateInsights(input: AIInsightsInput): Promise<AIInsightsOutput> {
  const dataRingkas = input.transactions
    .slice(0, 20)
    .map((t) => `${t.tanggal}: ${t.jenis} ${t.jumlah} (${t.kategori}) - ${t.jenis === "pemasukan" ? "+" : "-"}`)
    .join("\n");

  const prompt = `
Analisis data transaksi UMKM berikut untuk periode ${input.periode}:

${dataRingkas}

Berikan wawasan bisnis dalam Bahasa Indonesia yang mudah dipahami. Output HARUS JSON:
{
  "ringkasan": "ringkasan kondisi bisnis dalam 2-3 kalimat",
  "totalPemasukan": number (total semua pemasukan),
  "totalPengeluaran": number (total semua pengeluaran),
  "labaBersih": number (pemasukan - pengeluaran),
  "kategoriTerlaris": "nama kategori dengan pemasukan tertinggi",
  "rekomendasi": ["rekomendasi 1", "rekomendasi 2", "rekomendasi 3"],
  "grafikSummary": "deskripsi singkat tren (naik/turun/stabil)"
}`;

  const raw = await generateContent(SYSTEM_INSIGHTS, prompt);
  try {
    return JSON.parse(extractJson(raw)) as AIInsightsOutput;
  } catch {
    const pemasukan = input.transactions
      .filter((t) => t.jenis === "pemasukan")
      .reduce((sum, t) => sum + t.jumlah, 0);
    const pengeluaran = input.transactions
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((sum, t) => sum + t.jumlah, 0);

    return {
      ringkasan: "Data transaksi Anda menunjukkan aktivitas bisnis yang perlu dianalisis lebih lanjut.",
      totalPemasukan: pemasukan,
      totalPengeluaran: pengeluaran,
      labaBersih: pemasukan - pengeluaran,
      kategoriTerlaris: "Umum",
      rekomendasi: ["Catat transaksi secara rutin", "Pisahkan keuangan pribadi dan bisnis", "Analisis produk terlaris setiap bulan"],
      grafikSummary: "Data masih terbatas untuk analisis tren",
    };
  }
}
