# Solumkm: Asisten Bisnis Ber-AI untuk UMKM

**Usaha kecil naik kelas. Tanpa ribet.**

Catat penjualan pakai bahasa sehari-hari (diketik atau diucapkan), biarkan AI
merapikan pembukuan dan memberi saran bisnis. Laporan penting bisa dikunci
permanen di blockchain agar angkanya bisa dibuktikan apa adanya.

Dibangun untuk **IDCamp Developer Challenge #2, Digitalization & Acceleration
of MSMEs with Generative AI**.

- **Live:** https://solumkm.vercel.app
- **Repo:** https://github.com/bryankwandou/solumkm

## Coba langsung (akun demo juri)

| | |
|---|---|
| Email | `juri@solumkm.app` |
| Kata sandi | `solumkm2026` |

Akun ini sudah berisi transaksi contoh sehingga dashboard, wawasan AI, dan
tombol verifikasi bisa langsung dicoba.

## Alur produk

1. **Cerita apa adanya**, ketik atau ucapkan, mis. *"jual ayam geprek 12 porsi 180rb hari ini"*.
2. **AI merapikan**, Groq (Llama 3.3 70B) memilah jenis, jumlah, kategori, dan tanggal.
3. **Laporan jadi**, omzet, pengeluaran, dan laba bersih terhitung otomatis.
4. **AI memberi saran**, tanpa diminta: apa yang naik, apa yang turun, apa yang perlu dilakukan.
5. **Kunci permanen**, sidik SHA-256 laporan ditulis ke Solana devnet; siapa pun bisa memverifikasinya di explorer.

## Kenapa AI dan blockchain sekaligus

- **AI adalah produknya.** Ia yang mencatat, menghitung, dan menyarankan, bukan sekadar menjawab pertanyaan.
- **Blockchain adalah lapisan kepercayaan.** Catatan yang gampang diedit susah dipercaya saat mengajukan pinjaman. Sidik digital yang dianchor ke Solana membuat laporan bisa dibuktikan tanpa harus percaya pada database kami. Di UI hanya muncul tanda **Terverifikasi**, hash, wallet, dan RPC disembunyikan.

## Bukti on-chain (contoh)

Setiap laporan yang dikunci menghasilkan memo `solumkm:v1:<sha256>` di devnet.
Contoh transaksi terverifikasi:
`5qE6pVArnv7HUFWGKtRMCqZ2pYDbx2SrJ8PgsL3XcUiCBbVipj4jaqRwMVNrXtqx82KpF3haGzWhWPQVzaJyHeBw`
→ lihat di [Solana Explorer (devnet)](https://explorer.solana.com/tx/5qE6pVArnv7HUFWGKtRMCqZ2pYDbx2SrJ8PgsL3XcUiCBbVipj4jaqRwMVNrXtqx82KpF3haGzWhWPQVzaJyHeBw?cluster=devnet).

Atau cek sendiri tanpa perlu masuk di halaman **[Bukti Terverifikasi](https://solumkm.vercel.app/bukti)** —
tempel signature transaksi dan lihat sidik laporannya dibaca langsung dari jaringan Solana.

## Teknologi

| Lapisan | Pilihan |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Framer Motion |
| Bahasa | TypeScript |
| AI | Groq, Llama 3.3 70B (OpenAI-compatible) |
| Suara | Web Speech API (`id-ID`), tanpa API key |
| Integritas | SHA-256 via Web Crypto |
| Blockchain | Solana devnet (SPL Memo program), `@solana/web3.js` |
| Database | Neon Postgres (`pg`) |
| Auth | JWT (jose) + bcrypt |
| Hosting | Vercel |

## Menjalankan lokal

```bash
npm install
cp .env.example .env    # lalu isi nilainya
npm run dev
```

Variabel lingkungan yang dibutuhkan:

```
DATABASE_URL=          # Postgres (Neon)
JWT_SECRET=            # string acak panjang
GROQ_API_KEY=          # https://console.groq.com
GROQ_MODEL=llama-3.3-70b-versatile
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_SECRET_KEY=     # kunci devnet (base58 / hex / JSON array)
```

## Status & peta jalan

Sudah jalan: pencatatan AI (teks & suara), dashboard real-time dari database
nyata, wawasan AI, generator konten pemasaran, dan penguncian laporan ke Solana
devnet yang benar-benar terverifikasi on-chain.

Berikutnya: OCR foto struk, integrasi WhatsApp, dan migrasi anchoring ke
mainnet dengan biaya yang disponsori.
