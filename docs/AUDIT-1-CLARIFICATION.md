# Audit #1 Clarification

Dokumen ini disusun sebagai klarifikasi tindak lanjut atas catatan bahwa antarmuka sebelumnya terlalu menyerupai halaman latihan dan memuat data contoh.

## Perbaikan yang dilakukan
- Seeded account bawaan dihapus.
- Form login tidak lagi terisi data contoh secara otomatis.
- Alur penggunaan diperjelas: pengguna membuat akun terlebih dahulu.
- Landing page dan dokumentasi direvisi agar tidak menampilkan narasi data contoh.
- Endpoint `GET /api/auth/me` ditambahkan untuk verifikasi token bearer yang sah.

## Posisi Produk Saat Ini
- Aplikasi ini merupakan implementasi teknis untuk autentikasi JWT dan CRUD.
- Data yang muncul berasal dari aksi pengguna saat runtime, bukan dari data contoh yang ditampilkan sebagai konten publik.
- Penyimpanan masih in-memory (belum PostgreSQL), sehingga data tidak persisten antar restart server. Batasan ini telah dijelaskan terbuka di dokumentasi.

## Komitmen Revisi Lanjutan
- Migrasi penyimpanan ke PostgreSQL + Prisma.
- Penambahan validasi dan audit logging tingkat produksi.
- Penguatan kebijakan data untuk konteks sistem pemerintahan.
