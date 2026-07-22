# Dokumen Summary Pembelajaran — Minggu 1 (Senin 13 Juli – Kamis 16 Juli 2026)

**Nama:** Vincentius Bryan Kwandou
**GitLab:** https://gitlab.com/nayrbryanGaming
**Email:** wall.breaker.king.commander@gmail.com

---

## 1. Ringkasan Per Hari

### Senin, 13 Juli 2026 — Setup & Dasar Framework
- Belajar dasar Spring Boot framework dan uji coba menjalankannya di localhost.
- Setup tooling: install extension Angular, GitLab, dan Go di VS Code.

### Selasa, 14 Juli 2026 — Auth & Deployment
- Membuat login page berbasis JWT (JSON Web Token): alur register, login, penyimpanan token, dan proteksi halaman dashboard.
- Membuat dan menguji desain landing page menggunakan Next.js.
- Uji coba deployment ke Vercel.
- Integrasi database Neon (serverless Postgres) melalui API.

### Rabu, 15 Juli 2026 — Docker & GitLab
- Membuat repository baru di GitLab dan push project (branch `submission`).
- Menulis `Dockerfile` (multi-stage build untuk Next.js) dan `docker-compose.yml` (2 service: web + PostgreSQL).
- Menjalankan full-stack app (DB + API + FE) di Docker melalui Killercoda Ubuntu playground.
- Memverifikasi koneksi antar-container: API berhasil membaca/menulis ke PostgreSQL container (endpoint `/api/health/db` mengembalikan `db: connected`).
- Refactor koneksi database dari driver Neon serverless ke driver `pg` standar agar aplikasi bisa jalan baik di Postgres lokal (container) maupun Neon cloud.

### Kamis, 16 Juli 2026 — Alternatif Environment
- Menjalankan Docker melalui GitHub Codespaces sebagai alternatif environment.
- Membuat public access link untuk aplikasi Docker (port forwarding Codespaces).
- Sinkronisasi project di beberapa device.

---

## 2. Apa yang Dipelajari (Konsep)

**Docker & Containerization**
- Perbedaan image vs container; lifecycle container (build → up → ps → logs).
- Multi-stage Dockerfile: stage `deps` → `builder` → `runner` untuk memperkecil image produksi.
- `docker-compose` untuk orchestrate beberapa service (app + database) dalam satu network internal, termasuk `depends_on` + `healthcheck` agar app menunggu database siap.
- Environment variable sebagai cara inject konfigurasi (DATABASE_URL, JWT_SECRET) saat runtime — bukan di-hardcode saat build.
- Pentingnya `.dockerignore` agar build context kecil dan cepat.

**Autentikasi JWT**
- Alur token: server menandatangani token saat login, client mengirim token di header/cookie, server memverifikasi di setiap request terproteksi.
- Password tidak pernah disimpan mentah — di-hash dengan bcrypt.

**Database**
- Perbedaan Postgres lokal (container) vs serverless (Neon): driver HTTP serverless tidak bisa dipakai konek ke Postgres lokal, sehingga perlu driver `pg` standar + connection pool.
- Konsep lazy initialization: koneksi DB baru dibuat saat request pertama, supaya proses build tidak butuh database.

**Deployment & Git**
- Deploy Next.js ke Vercel + set environment variable production.
- Git remote lebih dari satu (GitLab + GitHub), push branch spesifik, protected branch, dan personal access token untuk autentikasi HTTPS.

---

## 3. Bagian yang Kurang / Belum Dimengerti

1. **Windows virtualization internals** — kenapa Hyper-V / Virtual Machine Platform gagal diaktifkan meski VT-x sudah enabled di BIOS (error DISM rollback, dugaan konflik Credential Guard). Ini blocker utama kenapa Docker Desktop belum bisa jalan di laptop lokal.
2. **Docker networking lanjutan** — baru paham network default compose; belum paham custom network, volume mount strategy untuk development (hot-reload), dan komunikasi antar-compose-project.
3. **Perbedaan detail Spring Boot vs Next.js API routes** — minggu ini backend akhirnya memakai Next.js API routes; pemahaman Spring Boot (dependency injection, JPA/Hibernate) masih di tahap dasar dan perlu diperdalam sebelum dipakai di project.
4. **CI/CD** — belum pernah setup pipeline GitLab CI (`.gitlab-ci.yml`) untuk build/test/deploy otomatis.
5. **Manajemen secret yang benar** — sudah paham dasarnya (jangan commit `.env`), tapi belum paham tooling seperti secret manager / rotasi credential yang rapi.

---

## 4. Blocker Sepanjang Minggu

| Blocker | Status |
|---|---|
| Hyper-V/WSL2 tidak bisa aktif walau VT-x BIOS sudah enabled (DISM "couldn't complete the features", rollback setiap restart) | Belum solved — sementara pakai Killercoda / Codespaces |
| Instalasi Ubuntu di VirtualBox gagal (network error saat install + `VERR_INTERNAL_ERROR` adapter) | Ditinggalkan, ganti pendekatan |
| Docker Desktop tidak bisa jalan karena dependensi WSL2 | Workaround: Docker di cloud environment |
| Laptop lag/crash saat development | Berkurang setelah pindah beban ke cloud |

**Workaround yang dipakai:** menjalankan Docker di Killercoda Ubuntu playground dan GitHub Codespaces, sehingga seluruh tugas Docker tetap terpenuhi (container running, compose stack, bukti screenshot) meski laptop lokal belum bisa virtualisasi.

---

## 5. Deliverables

- Live app (Vercel + Neon): https://springboot-login-jwt.vercel.app
- Repo GitLab (public, default branch `submission`): https://gitlab.com/nayrbryanGaming/springboot-login-jwt
- Script Docker: `Dockerfile`, `docker-compose.yml` (ada di repo)
- Screenshot `docker ps` dua container running (web + postgres) — sudah dikirim Rabu
