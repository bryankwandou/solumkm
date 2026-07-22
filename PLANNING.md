# SOLUMKM — Mega Planning Document
## IDCamp Developer Challenge #2 — Digitalization & Acceleration of MSMEs with Generative AI

---

## 1. FINAL LOCKED NAME

**Solumkm** (Solana × UMKM)
- GitHub: `solumkm/solumkm` ✅ TERSEDIA (404 confirmed)
- Vercel: `solumkm.vercel.app` ✅ TERSEDIA
- NPM: `solumkm` (belum dicek, low priority)
- Arti: "Solo" = sendiri/mandiri + "UMKM" = usaha kecil. Juga "Sol" = Solana.
- Tagline: "Usaha kecil naik kelas. Tanpa ribet."

---

## 2. BLACK-BOX ROASTING AUDIT (IDE V1 → IDE V2)

### Kelemahan fatal ide awal (UMKM Pintar):
1. **Zero diferensiasi** — AI marketing + finance sudah ada di MokaPOS, BukuWarung, Qasir
2. **No Web3** — hanya SaaS standar, tidak ada keunggulan kompetitif
3. **Web-only** — UMKM Indonesia 90% pakai HP, bukan desktop
4. **Data dummy** — tidak ada source of truth (marketplace API, rekening)
5. **AI gimmick** — 31% UMKM sudah pakai AI tools, apa bedanya?
6. **Nama generik** — "UMKM Pintar" tidak memorable

### Perbaikan wajib (Solumkm V2):
1. **Web3 audit trail** — setiap transaksi dicatat hash-nya ke Solana devnet → anti-fraud, bukti kepemilikan digital
2. **NFT Receipt** — setiap transaksi keuangan → mint NFT receipt di Solana (bisa untuk audit, pinjaman bank, credit scoring)
3. **WhatsApp-first interface** — bot WhatsApp sebagai kanal utama input transaksi
4. **Multi-marketplace exporter** — generate listing Shopee/Tokopedia/Amazon otomatis + terjemahan
5. **Credit scoring untuk UMKM** — data transaksi on-chain → profil kredit → akses pinjaman mikro
6. **Nama Silicon Valley standard** — Solumkm, mudah diingat, brandable

### Skor ide:
- Ide awal (UMKM Pintar): **45/100**
- Solumkm V2 (setelah roasting): **target 95/100**

---

## 3. BUSINESS MODEL CANVAS

| Komponen | Detail |
|----------|--------|
| **Value Proposition** | AI + Web3 untuk UMKM: catat transaksi → verifikasi on-chain → dapat skor kredit → akses pasar global |
| **Customer Segments** | UMKM Indonesia (warung, kuliner, fashion, jasa), 64 juta pelaku |
| **Channels** | WhatsApp bot, Web app (mobile-first PWA), API untuk marketplace |
| **Customer Relationships** | Self-service + komunitas Telegram + partner IDCamp |
| **Revenue Streams** | Freemium (basic gratis), Premium (Rp 50rb/bulan: export multi-marketplace + credit scoring), Enterprise API |
| **Key Resources** | Gemini AI, Solana devnet, PostgreSQL, WhatsApp Business API |
| **Key Activities** | AI training Bahasa Indonesia, Smart contract development, Community building |
| **Key Partners** | Solana Foundation, Google AI, Dicoding, Kemenkop UKM, marketplace (Shopee/Tokopedia) |
| **Cost Structure** | Server (Vercel/Railway), Gemini API, Solana gas fees (devnet free), WhatsApp API |

---

## 4. SWOT ANALYSIS

### Strengths
- Web3 integration unik — tidak ada kompetitor yang gabung AI + blockchain untuk UMKM
- Bahasa Indonesia natural language AI, paham konteks lokal
- Mobile-first, WhatsApp bot sebagai kanal utama

### Weaknesses
- Solana masih asing bagi UMKM — perlu edukasi
- MVP belum production-ready untuk skala jutaan user
- Ketergantungan pada API pihak ketiga (Gemini, Solana RPC)

### Opportunities
- 64 juta UMKM, hanya 12% terdigitalisasi → TAM sangat besar
- Program pemerintah: digitalisasi UMKM, KUR, sertifikasi halal
- Tren Web3 di Indonesia meningkat (crypto adoption #7 dunia)
- IDCamp sebagai launchpad + talent pipeline

### Threats
- Kompetitor established: BukuWarung, MokaPOS punya funding besar
- Regulasi crypto di Indonesia masih abu-abu
- Adopsi Web3 di kalangan UMKM rendah
- Deadline submission ketat (22 Juli 2026)

---

## 5. 10 PRINSIP HACKATHON DITERAPKAN

1. **Problem-first, not tech-first** — mulai dari pain point nyata UMKM (pencatatan manual, tidak bisa dapat pinjaman)
2. **Demo-able in 3 minutes** — flow jelas: daftar → catat transaksi → lihat NFT receipt → lihat skor kredit
3. **Unique selling point jelas** — "UMKM pertama dengan bukti transaksi di blockchain"
4. **Real data, not dummy** — integrasi dengan Google Sheets / CSV export untuk real UMKM partner
5. **Scalable architecture** — microservices-ready, API-first
6. **Mobile-first design** — PWA, bisa di-install di homescreen HP
7. **Bahasa Indonesia natural** — tidak ada kata-kata teknis yang membingungkan
8. **Security by design** — JWT + rate limiting + input sanitization
9. **Open source** — GitHub public, bisa diaudit dan dikontribusi
10. **Pitch-ready** — project brief, demo video, slide deck siap dalam 1 paket

---

## 6. TECH STACK FINAL

### Frontend
- Next.js 16 (App Router) — React framework
- Tailwind CSS 4 + Skiper UI (160+ komponen animasi)
- Framer Motion — page transitions & micro-interactions
- PWA — service worker, offline support

### Backend
- Next.js API Routes — REST API
- JWT + bcrypt — authentication
- PostgreSQL (Neon) — database
- Prisma ORM — type-safe queries

### AI Layer
- Google Gemini 2.0 Flash — natural language processing
- Custom prompts for Bahasa Indonesia UMKM context

### Web3 / Blockchain
- Solana Web3.js — blockchain interaction
- Solana Devnet — development network
- Metaplex — NFT minting (receipt)
- Phantom Wallet — user wallet (optional, ada fallback custodial)

### External APIs
- WhatsApp Business Cloud API — bot interaction
- Google Translate API — multi-language export
- Midtrans/Xendit — payment gateway (future)

### DevOps
- Vercel — hosting
- GitHub Actions — CI/CD
- Vercel Edge Functions — low-latency API

---

## 7. FEATURE ROADMAP MVP

### Phase 1: Core (submit today)
- [x] Landing page with Skiper UI animations
- [x] Auth (register/login/logout)
- [x] AI Marketing content generator
- [x] AI Finance transaction recorder
- [x] Dashboard with AI insights
- [ ] Solana devnet integration — record transaction hash
- [ ] NFT receipt minting on devnet
- [ ] PWA manifest + service worker

### Phase 2: Post-submission (within 1 week)
- [ ] WhatsApp bot endpoint
- [ ] Multi-marketplace export (Shopee/Tokopedia CSV)
- [ ] Credit scoring dashboard
- [ ] Phantom Wallet connect

### Phase 3: Scale (1 month)
- [ ] Mobile app (React Native)
- [ ] Partner UMKM onboarding
- [ ] Mainnet deployment
- [ ] KUR/Kredit integration

---

## 8. DESIGN SYSTEM — SOLUMKM

### Brand Identity
- **Name:** Solumkm
- **Tagline:** "Usaha kecil naik kelas. Tanpa ribet."
- **Tone:** Hangat, memberdayakan, profesional, low profile, humanis, 0% AI-ish

### Color Palette (Silicon Valley Standard — Stark Minimal + Gradient Trust)
- **Primary:** #0A0A0A (deep black)
- **Accent:** #9945FF (Solana purple gradient)
- **Secondary:** #14F195 (Solana green)
- **Surface:** #FFFFFF, #F8F9FA
- **Text:** #0A0A0A, #6B7280

### Typography
- **Display:** Cabinet Grotesk / Clash Display (bold, modern)
- **Body:** Inter / Plus Jakarta Sans (clean, readable)
- **Mono:** JetBrains Mono (code/addresses)

### Logo Concept
- Icon: "S" stylized dengan elemen gradient ungu-hijau (Solana colors), bentuknya seperti tangan memegang koin, atau seedling (tumbuh).
- Wordmark: "solumkm" lowercase, rounded, tebal.

---

## 9. COMPETITIVE LANDSCAPE

| Kompetitor | Keunggulan | Kelemahan vs Solumkm |
|-----------|-----------|---------------------|
| BukuWarung | 6M+ users, simple UI | Tidak ada AI, tidak ada blockchain |
| MokaPOS | Point of sale lengkap | Mahal, web-only, tidak ada credit scoring |
| Qasir | POS + inventory | Fokus retail besar, tidak ramah UMKM mikro |
| CrediBook | Pencatatan + invoice | Tidak ada AI generatif, tidak ada Web3 |
| **Solumkm** | **AI + Web3 + WhatsApp + Export + Credit Scoring** | **Baru launching (MVP)** |

**Kesimpulan:** Tidak ada kompetitor yang menggabungkan Generative AI + Solana blockchain + WhatsApp + multi-marketplace export dalam satu platform untuk UMKM.

---

## 10. MONETIZATION PATH

1. **Freemium** — 100 transaksi/bulan gratis, AI basic
2. **Premium (Rp 49.000/bulan)** — unlimited transaksi, NFT receipt, export marketplace, credit scoring
3. **Enterprise (Rp 499.000/bulan)** — API access, custom branding, dedicated support, multi-cabang
4. **Transaction fee** — 0.5% dari nilai transaksi yang diverifikasi on-chain (future)

---

## 11. LAUNCH STRATEGY

1. **IDCamp Developer Challenge** — launch MVP, dapat exposure ke 10.000+ peserta
2. **Solana Foundation Grant** — apply setelah menang hackathon
3. **Partner UMKM binaan** — onboarding 10 UMKM asli sebagai beta tester
4. **Konten edukasi** — "UMKM Go Digital" series di TikTok/Instagram
5. **WhatsApp bot virality** — share fitur ke grup UMKM, network effect

---

*Dokumen ini adalah living document. Update terakhir: 22 Juli 2026.*
