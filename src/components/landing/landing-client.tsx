"use client";

import type { PointerEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { HeroCanvas } from "./hero-canvas";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Languages,
  Mic,
  PenTool,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

const TIMING = {
  hero: 0,
  visual: 0.1,
  step: 0.07,
};

/** What the copilot does *for* the user — each entry is an action, not a chat reply. */
const capabilities = [
  {
    icon: Wallet,
    title: "Mencatat sendiri",
    desc: 'Ketik "jual bakso 20 porsi 200rb". AI langsung tahu itu pemasukan, berapa jumlahnya, dan masuk kategori apa. Tidak ada form yang harus diisi.',
  },
  {
    icon: BarChart3,
    title: "Menghitung sendiri",
    desc: "Omzet, pengeluaran, dan laba bersih terhitung otomatis setiap kali kamu mencatat. Tidak perlu Excel, tidak perlu tahu akuntansi.",

  },
  {
    icon: Bell,
    title: "Menegur duluan",
    desc: 'AI yang bicara lebih dulu: "penjualan mie ayam turun 28% dari minggu lalu" — tanpa kamu harus bertanya.',

  },
  {
    icon: PenTool,
    title: "Menulis promosi",
    desc: "Caption Instagram, deskripsi Shopee, dan balasan WhatsApp yang sopan — siap tempel dalam hitungan detik.",

  },
  {
    icon: Languages,
    title: "Membuka pasar baru",
    desc: "Deskripsi produk diterjemahkan ke Inggris, Arab, dan Mandarin supaya bisa masuk pasar luar.",

  },
  {
    icon: ShieldCheck,
    title: "Menjaga catatan",
    desc: "Laporan yang sudah final dikunci dengan sidik digital, jadi angkanya bisa dibuktikan apa adanya saat mengajukan pinjaman.",

  },
];

const steps = [
  { title: "Cerita apa adanya", desc: 'Tulis atau ucapkan seperti kamu cerita ke teman: "tadi laku 12 porsi".' },
  { title: "AI merapikan", desc: "Jumlah, kategori, dan tanggal dipisahkan otomatis lalu disimpan." },
  { title: "Laporan jadi", desc: "Laba bersih dan produk terlaris langsung terhitung di dashboard." },
  { title: "Catatan dikunci", desc: "Laporan final diberi tanda terverifikasi agar tidak bisa diubah diam-diam." },
];

const stats = [
  { value: "64 juta", label: "pelaku UMKM di Indonesia" },
  { value: "60%", label: "sumbangan UMKM ke PDB nasional" },
  { value: "12%", label: "yang benar-benar terdigitalisasi" },
];

const faq = [
  {
    q: "Saya gaptek. Susah tidak dipakainya?",
    a: "Tidak ada menu rumit. Kamu cuma perlu menulis satu kalimat bahasa Indonesia biasa, sisanya dikerjakan AI. Kalau bisa mengirim pesan WhatsApp, kamu bisa memakai Solumkm.",
  },
  {
    q: "Kenapa catatan perlu diverifikasi?",
    a: "Karena catatan yang gampang diedit susah dipercaya pihak lain. Saat mengajukan pinjaman atau membuka pembukuan ke investor, laporan yang punya tanda terverifikasi lebih kuat dibanding angka yang bisa diketik ulang kapan saja.",
  },
  {
    q: "Apakah saya perlu dompet kripto?",
    a: "Tidak. Verifikasi berjalan di belakang layar. Kamu cukup daftar pakai email seperti aplikasi biasa.",
  },
  {
    q: "Bisa dikte pakai suara?",
    a: "Bisa, di peramban yang mendukungnya (misalnya Chrome). Tekan tombol Ucapkan di halaman Catat Transaksi, sebutkan transaksimu, dan teksnya muncul sendiri untuk dirapikan AI.",
  },
  {
    q: "Datanya nyata atau contoh?",
    a: "Nyata. Setiap transaksi yang kamu catat tersimpan di database dan dihitung ulang langsung — bukan angka contoh yang ditulis di dalam kode.",
  },
];

export function LandingClient() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

  // Pointer-driven 3D tilt for the hero card. Raw pointer offset feeds two
  // springs so the motion settles smoothly; disabled entirely under
  // prefers-reduced-motion so it never fights accessibility.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateX = useTransform(tiltX, (v) => (reduceMotion ? 0 : v));
  const rotateY = useTransform(tiltY, (v) => (reduceMotion ? 0 : v));

  function handleTilt(event: PointerEvent<HTMLDivElement>) {
    // Mouse only: touch drags should scroll the page, not tilt the card.
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 12); // horizontal pointer → rotate around Y
    tiltX.set(py * -12); // vertical pointer → rotate around X
  }

  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <main className="site-main">
      {/* ------------------------------------------------------------- HERO */}
      <section className="hero-section">
        <HeroCanvas />
        <div className="container hero-layout">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="show"
            variants={reveal}
            transition={{ ...spring, delay: TIMING.hero }}
          >
            <p className="section-kicker">
              <Sparkles aria-hidden="true" size={13} />
              Asisten bisnis ber-AI untuk UMKM
            </p>

            <h1>Cerita jualanmu. Sisanya biar AI yang kerjakan.</h1>

            <p className="hero-lead">
              Tulis satu kalimat biasa. Pembukuan langsung rapi, laba ikut terhitung, dan saran
              bisnis muncul dengan sendirinya. Kalau laporan sudah pas, kamu bisa menguncinya supaya
              angkanya tidak bisa diubah diam-diam.
            </p>

            <div className="hero-actions">
              <Link className="button button-primary" href="/register">
                Coba Gratis Sekarang
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="button button-secondary" href="/login">
                Saya sudah punya akun
              </Link>
            </div>

            <p className="hero-note">
              <span className="badge badge-verified">
                <ShieldCheck aria-hidden="true" size={13} />
                Catatan terverifikasi
              </span>
              <span>Gratis · Daftar pakai email · Tanpa kartu kredit</span>
            </p>
          </motion.div>

          {/* Preview: the copilot taking action, not answering a question.
              Tilts toward the pointer in 3D for a tactile, live feel. */}
          <motion.div
            className="product-visual"
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: TIMING.visual }}
            onPointerMove={handleTilt}
            onPointerLeave={resetTilt}
            style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
          >
            <div className="visual-toolbar">
              <span />
              <span />
              <span />
              <strong>Solumkm · catat transaksi</strong>
            </div>

            <div className="token-strip">
              <Mic aria-hidden="true" size={16} />
              <span>Ketik atau ucapkan — bahasa sehari-hari sudah cukup</span>
            </div>

            <div className="chat-mock" aria-label="Contoh percakapan dengan asisten">
              <div className="chat-row chat-out">
                Tadi siang laku ayam geprek 12 porsi, totalnya 180 ribu.
              </div>

              <div className="chat-row chat-in">
                <strong>
                  <Sparkles aria-hidden="true" size={12} />
                  Sudah dicatat
                </strong>
                <p>Pemasukan hari ini bertambah. Stok ayam geprek berkurang 12 porsi.</p>
                <ul className="chat-facts">
                  <li>
                    <span>Jenis</span>
                    <span>Pemasukan · Makanan</span>
                  </li>
                  <li>
                    <span>Jumlah</span>
                    <span className="mono">Rp180.000</span>
                  </li>
                  <li>
                    <span>Laba hari ini</span>
                    <span className="mono">Rp96.500</span>
                  </li>
                </ul>
              </div>

              <div className="chat-row chat-in">
                <strong>
                  <TrendingUp aria-hidden="true" size={12} />
                  Saran tanpa diminta
                </strong>
                <p>
                  Ayam geprek menyumbang 62% keuntunganmu minggu ini. Stoknya diperkirakan habis
                  dalam 3 hari.
                </p>
              </div>
            </div>

            <div className="chat-foot">
              <span className="badge badge-verified">
                <ShieldCheck aria-hidden="true" size={13} />
                Laporan harian terverifikasi
              </span>
              <span className="badge badge-ai">
                <Sparkles aria-hidden="true" size={13} />
                Ditulis oleh AI
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------------- THE STORY */}
      <section className="container story-section">
        <motion.article
          className="story-panel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          transition={spring}
        >
          <div>
            <p className="section-kicker">Masalahnya</p>
            <blockquote className="story-quote">
              &ldquo;Setiap hari saya catat di buku tulis. Waktu mau ajukan pinjaman, saya tidak
              punya laporan yang bisa ditunjukkan.&rdquo;
            </blockquote>
            <p className="story-attrib">
              Cerita yang terdengar di hampir semua warung — pencatatan ada, tapi tidak bisa
              dipakai saat dibutuhkan.
            </p>
          </div>

          <div className="before-after">
            <div className="ba-row" data-tone="before">
              <small>Sebelum</small>
              <strong>±3 menit per transaksi</strong>
              <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                Ditulis manual, laporan direkap akhir bulan
              </span>
            </div>
            <div className="ba-row" data-tone="after">
              <small>Sesudah</small>
              <strong>±20 detik per transaksi</strong>
              <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                Satu kalimat, laporan langsung jadi dan terverifikasi
              </span>
            </div>
          </div>
        </motion.article>
      </section>

      {/* -------------------------------------------------------------- DATA */}
      <section className="container proof-grid" aria-label="Data UMKM Indonesia">
        {stats.map((item, index) => (
          <motion.article
            className="proof-card"
            key={item.label}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={reveal}
            transition={{ ...spring, delay: index * TIMING.step }}
          >
            <span>{item.value}</span>
            <p>{item.label}</p>
          </motion.article>
        ))}
      </section>

      {/* ----------------------------------------------------------- HOW IT WORKS */}
      <section className="container system-section">
        <div className="section-heading">
          <p className="section-kicker">Cara kerjanya</p>
          <h2>Empat langkah, dan tidak satu pun butuh keahlian teknis.</h2>
        </div>

        <ol className="step-list">
          {steps.map((item, index) => (
            <motion.li
              className="step-item"
              key={item.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={reveal}
              transition={{ ...spring, delay: index * TIMING.step }}
            >
              <span className="step-num" aria-hidden="true">
                {index + 1}
              </span>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* --------------------------------------------------------- WHAT IT DOES */}
      <section className="container system-section" id="fitur">
        <div className="section-heading">
          <p className="section-kicker">Yang dikerjakan AI</p>
          <h2>Bukan chatbot yang cuma menunggu ditanya. Ini asisten yang benar-benar bekerja.</h2>
        </div>

        <div className="feature-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                className="feature-card"
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={reveal}
                transition={{ ...spring, delay: (index % 3) * TIMING.step }}
              >
                <Icon aria-hidden="true" size={22} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------- WHY VERIFIED */}
      <section className="container section-grid">
        <article className="content-panel">
          <p className="section-kicker">Kenapa perlu diverifikasi</p>
          <h2>Catatan yang gampang diedit, susah dipercaya orang lain.</h2>
          <p>
            Saat mengajukan pinjaman atau menunjukkan pembukuan ke calon mitra, angka yang bisa
            diketik ulang kapan saja tidak berarti banyak. Solumkm mengunci laporan yang sudah
            final dengan sidik digital — kalau isinya diubah, sidiknya tidak akan cocok lagi.
          </p>
          <p style={{ marginBottom: 0 }}>
            Kamu tidak perlu tahu cara kerjanya. Di layar, yang muncul hanya satu tanda:{" "}
            <span className="badge badge-verified">
              <ShieldCheck aria-hidden="true" size={13} />
              Terverifikasi
            </span>
          </p>
        </article>

        <article className="content-panel checklist-panel">
          <p className="section-kicker">Yang kamu dapat</p>
          <ul className="clean-list">
            {[
              "Pembukuan rapi tanpa pernah membuka Excel.",
              "Laba bersih terhitung ulang setiap kali kamu mencatat.",
              "Saran bisnis yang muncul sendiri, bukan setelah ditanya.",
              "Konten promosi siap posting dalam hitungan detik.",
              "Laporan final yang bisa dibuktikan keasliannya.",
            ].map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="container system-section">
        <div className="section-heading">
          <p className="section-kicker">Pertanyaan yang sering muncul</p>
          <h2>Yang biasanya ditanyakan lebih dulu.</h2>
        </div>

        <div className="faq-list">
          {faq.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- FINAL CTA */}
      <section className="container section-grid">
        <article className="content-panel">
          <p className="section-kicker">Mulai hari ini</p>
          <h2>Catat satu transaksi. Lihat sendiri laporannya jadi.</h2>
          <p style={{ marginBottom: 0 }}>
            Gratis, daftar pakai email, tidak perlu memasang apa pun. Dibangun untuk IDCamp
            Developer Challenge #2 dengan satu tujuan: membuat usaha kecil punya pembukuan yang
            layak dipercaya.
          </p>
        </article>

        <article className="content-panel checklist-panel">
          <div className="hero-actions" style={{ flexDirection: "column", gap: "10px" }}>
            <Link className="button button-primary full-width" href="/register">
              Daftar Gratis
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button button-secondary full-width" href="/login">
              Masuk ke akun saya
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
