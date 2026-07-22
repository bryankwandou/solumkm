# Project Brief, Solumkm

**IDCamp Developer Challenge #2: Digitalization & Acceleration of MSMEs with Generative AI**

---

### Informasi Peserta

| No | Nama | Email Dicoding |
| :---: | :---: | :---: |
| 1 | Vincentius Bryan Kwandou | wall.breaker.king.commander@gmail.com |

---

### Problem Statement

Indonesia memiliki lebih dari 64 juta pelaku UMKM yang menyumbang sekitar 60%
PDB nasional, tetapi hanya sekitar 12% yang benar-benar terdigitalisasi.
Mayoritas masih mencatat penjualan secara manual di buku tulis. Akibatnya dua
masalah muncul bersamaan:

1. **Pencatatan memakan waktu dan mudah keliru.** Pemilik warung yang sibuk
   melayani pembeli tidak sempat merapikan angka, sehingga laba sebenarnya tidak
   pernah benar-benar diketahui.
2. **Catatan itu tidak bisa dipercaya pihak lain.** Ketika seorang pelaku UMKM
   ingin mengajukan pinjaman (KUR) atau menunjukkan pembukuan ke calon mitra,
   catatan buku tulis, atau bahkan angka di spreadsheet yang bisa diketik ulang
   kapan saja, sulit dijadikan bukti yang kredibel.

Yang terdampak adalah jutaan usaha mikro yang justru paling butuh akses
permodalan, namun tertahan karena tidak punya rekam jejak keuangan yang rapi dan
tepercaya.

---

### Deskripsi Produk/Aplikasi

**Solumkm** adalah asisten bisnis ber-AI untuk UMKM. Generative AI bukan
tempelan chatbot di atas aplikasi biasa, melainkan mesin utama produk ini.
Tiga pekerjaan inti seluruhnya digerakkan AI:

1. **Memahami bahasa manusia jadi data terstruktur.** Kalimat bebas seperti
   *"tadi siang laku ayam geprek 12 porsi, totalnya 180 ribu"* diurai AI menjadi
   jenis, jumlah, kategori, dan tanggal yang siap masuk pembukuan, lewat teks
   maupun suara. Tidak ada form yang harus diisi.
2. **Menganalisis dan menegur lebih dulu.** AI membaca seluruh transaksi lalu
   merangkum kondisi usaha dan memberi rekomendasi tindakan tanpa diminta,
   misalnya menandai produk yang labanya turun.
3. **Memproduksi konten dan listing.** AI menulis caption, deskripsi, dan ajakan
   siap posting, serta menerjemahkan produk ke Inggris, Arab, dan Mandarin untuk
   menembus pasar ekspor.

Agar aman dipakai orang awam, hasil bacaan AI selalu ditampilkan untuk
dikonfirmasi dan bisa dikoreksi sebelum disimpan, sehingga tidak ada angka yang
masuk tanpa persetujuan pemilik.

Untuk menjawab masalah kepercayaan, setiap laporan final dapat "dikunci" dengan
sidik digital (SHA-256) yang dicatat permanen ke jaringan **Solana (devnet)**.
Dengan begitu, laporan bisa dibuktikan keasliannya oleh siapa pun tanpa harus
mempercayai database kami, sebuah *verifiable business record*. Positioning-nya
tegas: **AI adalah produknya, blockchain hanya lapisan kepercayaan.** Di
antarmuka, pengguna hanya melihat tanda **"Terverifikasi"**; istilah teknis
seperti hash dan wallet sengaja disembunyikan agar tetap ramah untuk pengguna
non-teknis.

- **Aplikasi live:** https://solumkm.vercel.app
- **Kode sumber (publik):** https://github.com/bryankwandou/solumkm

---

### Fitur Utama dan Teknologi yang Digunakan

**Fitur utama**

* **Pencatatan transaksi dengan bahasa alami**, ketik atau **ucapkan** (suara), AI memilah jenis, jumlah, kategori, dan tanggal secara otomatis.
* **Konfirmasi sebelum simpan**, hasil bacaan AI ditampilkan untuk dicek dan dikoreksi dulu, jadi tidak ada salah catat yang lolos diam-diam.
* **Dashboard keuangan real-time**, omzet, pengeluaran, dan laba bersih dihitung ulang langsung dari database nyata (bukan data dummy).
* **Wawasan AI proaktif**, AI merangkum kondisi usaha dan memberi rekomendasi tindakan, tanpa perlu ditanya.
* **Studio konten pemasaran**, menghasilkan caption, hashtag, deskripsi, dan ajakan siap posting untuk Instagram/WhatsApp/Shopee/Tokopedia.
* **Ekspor multi-bahasa**, deskripsi produk otomatis dalam Inggris, Arab, dan Mandarin untuk menembus pasar internasional.
* **Unduh laporan (CSV)**, riwayat transaksi bisa diunduh sebagai spreadsheet untuk dibawa ke bank atau akuntan.
* **Verifiable business record**, mengunci sidik SHA-256 laporan ke Solana devnet; hasilnya dapat dicek publik di Solana Explorer.

**Teknologi**

* Next.js 16 (App Router) + React 19 + TypeScript
* Groq, Llama 3.3 70B (Generative AI, OpenAI-compatible)
* Web Speech API untuk input suara Bahasa Indonesia (`id-ID`)
* SHA-256 (Web Crypto) untuk sidik integritas
* Solana devnet + `@solana/web3.js` (SPL Memo program) untuk anchoring
* Neon Postgres sebagai basis data
* JWT (jose) + bcrypt untuk autentikasi
* Vercel untuk hosting

---

### Cara Penggunaan Product

**Akses login (credential demo)**

| | |
|---|---|
| Email | `juri@solumkm.app` |
| Kata sandi | `solumkm2026` |

Akun demo sudah berisi transaksi contoh sehingga fitur bisa langsung dinilai.

**Langkah-langkah penggunaan**

1. Buka https://solumkm.vercel.app lalu masuk dengan kredensial demo di atas (atau daftar akun baru dengan email).
2. Buka **Catat Transaksi**, tulis atau tekan **Ucapkan** lalu sebutkan mis. *"jual ayam geprek 12 porsi 180rb hari ini"*. AI langsung mencatatnya.
3. Buka **Dashboard** untuk melihat ringkasan omzet, pengeluaran, dan laba bersih yang terhitung otomatis, lalu tekan **Lihat Wawasan** untuk saran AI.
4. Pada Dashboard, tekan **Kunci permanen** untuk menulis sidik laporan ke Solana devnet, lalu buka **Lihat bukti di explorer** untuk memverifikasinya secara publik.
5. Buka **Buat Konten**, masukkan nama produk, dan dapatkan materi promosi siap pakai.

---

### Informasi Pendukung

* **Repositori (publik):** https://github.com/bryankwandou/solumkm
* **Aplikasi live:** https://solumkm.vercel.app
* **Contoh bukti on-chain (devnet):** transaksi memo `solumkm:v1:<sha256>` , 
  [lihat di Solana Explorer](https://explorer.solana.com/tx/5qE6pVArnv7HUFWGKtRMCqZ2pYDbx2SrJ8PgsL3XcUiCBbVipj4jaqRwMVNrXtqx82KpF3haGzWhWPQVzaJyHeBw?cluster=devnet).
* **Data real-time, bukan dummy:** seluruh transaksi tersimpan di Neon Postgres
  dan ringkasan dihitung ulang setiap saat; verifikasi berjalan di jaringan
  Solana yang sebenarnya.
* **Model bisnis & prospek startup:** Solumkm gratis untuk UMKM demi mendorong
  adopsi dan mengumpulkan rekam jejak transaksi yang terverifikasi. Sumber
  pendapatan justru di sisi **B2B**: rekam jejak terverifikasi itu ditawarkan
  sebagai API *credit scoring* berbasis data alternatif kepada penyalur KUR,
  BPR, dan platform P2P lending (seperti Amartha atau Investree) yang butuh cara
  menilai kelayakan kredit UMKM tanpa riwayat bank. Dengan begitu yang membayar
  adalah pemberi pinjaman, bukan pemilik warung, sehingga pertanyaan "siapa yang
  mau bayar" punya jawaban yang masuk akal dan model ini bisa diskalakan menjadi
  bisnis besar. Bila kelak ada tier premium untuk UMKM (misalnya ekspor multi
  marketplace), pembayarannya lewat rail lokal yang sudah mereka kenal seperti
  QRIS, bukan kripto, agar tetap ramah pengguna non-teknis.
* **Rencana pengembangan produk:** OCR foto struk, integrasi WhatsApp untuk
  pencatatan dari chat, dan migrasi anchoring ke Solana mainnet dengan biaya
  disponsori.

> **Catatan integritas:** aplikasi ini orisinal dan dibangun untuk challenge ini;
> belum pernah menjadi pemenang tantangan lain. Klaim kemitraan tidak
> dicantumkan karena belum ada; integrasi kanal seperti WhatsApp berada pada peta
> jalan, bukan diklaim sudah berjalan.
