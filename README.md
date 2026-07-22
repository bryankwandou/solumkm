# 🚀 UMKM Pintar — Asisten AI untuk Usaha Kecil Indonesia

Platform Generative AI yang membantu pelaku UMKM Indonesia membuat konten pemasaran, mencatat keuangan, dan menganalisis bisnis — cukup dengan bahasa Indonesia sehari-hari.

Dibangun untuk **IDCamp Developer Challenge #2: Digitalization & Acceleration of MSMEs with Generative AI**.

---

## 🎯 Fitur Utama

### 1. AI Marketing (Konten Pemasaran Otomatis)
- Generate caption Instagram, WhatsApp, Shopee, Tokopedia
- Hashtag rekomendasi otomatis
- Deskripsi produk + CTA (ajakan beli)
- Copy ke clipboard & share langsung ke WhatsApp
- **Input**: Nama produk + pilih platform + gaya bahasa
- **AI Model**: Google Gemini 2.0 Flash

### 2. AI Keuangan (Pencatatan Transaksi Cerdas)
- Catat pemasukan/pengeluaran pakai bahasa natural
- AI otomatis kategorikan (makanan, fashion, jasa, dll)
- Hitung total pemasukan, pengeluaran, laba bersih
- Riwayat transaksi dengan filter & hapus
- **Input**: "Jual nasi goreng 5 piring dapat 75rb"

### 3. Dashboard Analitik + Wawasan AI
- Ringkasan keuangan real-time
- Klik "Lihat Wawasan" → AI analisis data transaksi
- Rekomendasi bisnis berdasarkan data
- Kategori terlaris & tren grafik
- Manajemen produk/katalog sederhana

---

## 🏗️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| **Next.js 16** (App Router) | Full-stack framework |
| **TypeScript 6** | Type safety |
| **Tailwind CSS 4** | Styling (cartoon brutalist UMKM) |
| **Google Gemini AI** (gemini-2.0-flash) | Generative AI engine |
| **Neon PostgreSQL** | Database production |
| **JWT + bcrypt** | Authentication |
| **framer-motion** | Animasi UI |
| **lucide-react** | Ikon |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+
- PostgreSQL (Neon atau lokal)
- Google Gemini API Key ([dapatkan di sini](https://aistudio.google.com/apikey))

### Setup
```bash
npm install
cp .env.example .env
# Isi DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

Buka `http://localhost:3000`

---

## 📦 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── marketing/route.ts   # Generate konten marketing
│   │   │   ├── finance/route.ts     # Catat transaksi + list
│   │   │   └── insights/route.ts    # Analisis bisnis AI
│   │   └── auth/...                 # Login/register JWT
│   ├── ai-marketing/page.tsx        # Halaman AI Marketing
│   ├── ai-finance/page.tsx          # Halaman AI Keuangan
│   ├── dashboard/page.tsx           # Dashboard UMKM
│   └── login/ & register/          # Autentikasi
├── components/
│   ├── ai-marketing/                # UI generator konten
│   ├── ai-finance/                  # UI catat transaksi
│   ├── dashboard/                   # Dashboard + AI insights
│   ├── auth/                        # Login/register forms
│   ├── landing/                     # Landing page UMKM
│   └── layout/                      # Header navigasi
├── lib/
│   ├── ai.ts                        # Wrapper Gemini (marketing, finance, insights)
│   ├── auth.ts                      # JWT authentication
│   ├── db.ts                        # PostgreSQL connection
│   └── jwt.ts                       # Token management
└── services/                        # Client-side API calls
```

---

## 🔑 Environment Variables

```bash
DATABASE_URL=postgresql://...   # Neon PostgreSQL URL
JWT_SECRET=random-string-here
GEMINI_API_KEY=AIza...          # Google Gemini API key
```

---

## 📝 Kriteria Penilaian IDCamp

| Kriteria | Bobot | Implementasi |
|----------|-------|-------------|
| **Inovasi & Kebaruan** | 20% | AI paham bahasa natural Indonesia, 3 fitur terintegrasi |
| **Kesesuaian Tema** | 30% | Semua fitur pakai Generative AI untuk UMKM |
| **Manfaat Masyarakat** | 25% | Akses gratis, mobile-friendly, Bahasa Indonesia |
| **Desain & UX** | 25% | Cartoon brutalist, user-friendly untuk non-teknis |

---

## 🙏 Dukungan

- **IDCamp** / Dicoding Indonesia
- **Google Gemini AI**
- **Neon** serverless PostgreSQL

---

*Dibangun dengan ❤️ untuk UMKM Indonesia*
