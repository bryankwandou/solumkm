"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle, Loader2, Mic, Sparkles, Square, Trash2, Wallet } from "lucide-react";
import { useAuthToken } from "@/hooks/use-auth";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { requestJson, HttpError } from "@/services/http";

type Transaction = {
  id: string;
  jenis: string;
  jumlah: number;
  kategori: string;
  keterangan: string;
  tanggal: string;
  created_at: string;
};

export function FinanceClient() {
  const router = useRouter();
  const { token, ready } = useAuthToken();

  const [text, setText] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const appendTranscript = useCallback((spoken: string) => {
    setText((prev) => (prev ? `${prev} ${spoken}` : spoken));
  }, []);
  const voice = useVoiceInput(appendTranscript);

  const loadTransactions = useCallback(async (authToken: string) => {
    setLoadingList(true);
    try {
      const data = await requestJson<{ transactions: Transaction[] }>("/api/ai/finance", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTransactions(data.transactions);
    } catch {
      setError("Gagal memuat daftar transaksi.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (ready && !token) {
      router.push("/login");
      return;
    }
    if (token) loadTransactions(token);
  }, [ready, token, router, loadTransactions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setSuccess("");

    if (!text.trim()) {
      setError("Tulis transaksimu dulu. Contoh: 'jual bakso 20 porsi dapat 200rb'");
      return;
    }

    setLoadingSave(true);
    try {
      await requestJson<{ message: string; transaction: Transaction }>("/api/ai/finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      setText("");
      setSuccess("Transaksi berhasil dicatat!");
      await loadTransactions(token);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError("Gagal mencatat. Coba lagi.");
      }
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await requestJson(`/api/ai/finance?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadTransactions(token);
    } catch {
      setError("Gagal menghapus transaksi.");
    }
  }

  const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

  const totalPemasukan = transactions
    .filter((t) => t.jenis === "pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = transactions
    .filter((t) => t.jenis === "pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  if (!ready || !token) {
    return (
      <div className="dashboard-loading">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <p className="section-kicker">
              <Sparkles aria-hidden="true" size={13} />
              Catat transaksi
            </p>
            <h1>Cerita saja. Pembukuannya urusan AI.</h1>
            <p>
              Tulis seperti kamu bercerita ke teman. AI yang memilah mana pemasukan, mana
              pengeluaran, berapa jumlahnya, dan masuk kategori apa.
            </p>
          </div>
        </section>

        {/* RINGKASAN */}
        <section className="metric-grid" aria-label="Ringkasan keuangan">
          <article className="metric-card" style={{ background: "var(--success-soft)", borderColor: "rgba(8, 127, 91, 0.22)" }}>
            <ArrowUpCircle aria-hidden="true" size={20} color="var(--success)" />
            <span>{formatRupiah(totalPemasukan)}</span>
            <p>total pemasukan</p>
          </article>
          <article className="metric-card" style={{ background: "var(--danger-soft)", borderColor: "rgba(198, 40, 61, 0.24)" }}>
            <ArrowDownCircle aria-hidden="true" size={20} color="var(--danger)" />
            <span>{formatRupiah(totalPengeluaran)}</span>
            <p>total pengeluaran</p>
          </article>
          <article className="metric-card">
            <Wallet aria-hidden="true" size={20} />
            <span style={{ color: saldo >= 0 ? "var(--success)" : "var(--danger)" }}>
              {formatRupiah(saldo)}
            </span>
            <p>saldo bersih</p>
          </article>
        </section>

        <div className="dashboard-grid">
          {/* INPUT */}
          <section className="workspace-panel">
            <div className="panel-heading">
              <p className="section-kicker">Input Transaksi</p>
              <h2>Tulis transaksi harianmu.</h2>
            </div>

            <form className="form-panel" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <div className="split-heading" style={{ alignItems: "center" }}>
                  <label htmlFor="transaksi-text">Ceritakan transaksimu</label>
                  {voice.supported && (
                    <button
                      type="button"
                      className={voice.listening ? "button button-danger" : "button button-secondary"}
                      onClick={voice.toggle}
                      style={{ minHeight: "36px", padding: "0 12px", fontSize: "0.85rem" }}
                      aria-pressed={voice.listening}
                    >
                      {voice.listening ? (
                        <>
                          <Square aria-hidden="true" size={14} />
                          Berhenti
                        </>
                      ) : (
                        <>
                          <Mic aria-hidden="true" size={14} />
                          Ucapkan
                        </>
                      )}
                    </button>
                  )}
                </div>
                <textarea
                  id="transaksi-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Contoh: "Jual nasi goreng 5 piring dapat 75rb tadi siang" atau "Beli minyak goreng 20 liter 340rb hari ini"'
                />
                <p className="form-hint align-start" style={{ fontSize: "0.84rem" }}>
                  {voice.listening
                    ? "Mendengarkan… ucapkan transaksimu dengan jelas."
                    : voice.supported
                      ? "Ketik, atau tekan Ucapkan untuk mendikte. Bahasa sehari-hari sudah cukup."
                      : "Tidak perlu format khusus. Bahasa sehari-hari sudah cukup."}
                </p>
              </div>

              {error && <div className="alert error" role="alert">{error}</div>}
              {success && <div className="alert success" role="status">{success}</div>}

              <button className="button button-primary full-width" type="submit" disabled={loadingSave}>
                {loadingSave ? (
                  <>
                    <Loader2 aria-hidden="true" size={18} className="spin" />
                    AI memproses...
                  </>
                ) : (
                  <>
                    <Sparkles aria-hidden="true" size={18} />
                    Catat Transaksi
                  </>
                )}
              </button>
            </form>
          </section>

          {/* DAFTAR TRANSAKSI */}
          <section className="workspace-panel">
            <div className="panel-heading split-heading">
              <div>
                <p className="section-kicker">Riwayat</p>
                <h2>Transaksi terbaru.</h2>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                {transactions.length} catatan
              </p>
            </div>

            {loadingList ? (
              <div className="items-list">
                {[0, 1, 2].map((i) => (
                  <div className="item-card" key={i}>
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-text" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="empty-state">
                <Wallet aria-hidden="true" size={28} />
                <h3>Belum ada catatan transaksi.</h3>
                <p>Mulai catat transaksi pertamamu dari form sebelah kiri.</p>
              </div>
            ) : (
              <ul className="items-list" aria-label="Daftar transaksi">
                {transactions.map((t) => (
                  <li key={t.id} className="item-card">
                    <div className="item-card-head">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "999px",
                            background: t.jenis === "pemasukan" ? "var(--success)" : "var(--danger)",
                          }} />
                          <h3 style={{ margin: 0 }}>{t.keterangan || t.kategori}</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.88rem" }}>
                          {t.kategori} • {t.tanggal?.slice(0, 10)}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="tx-amount" style={{
                          color: t.jenis === "pemasukan" ? "var(--verified)" : "var(--danger)",
                        }}>
                          {t.jenis === "pemasukan" ? "+" : "-"}{formatRupiah(t.jumlah)}
                        </span>
                      </div>
                    </div>
                    <button
                      className="button button-secondary"
                      style={{ fontSize: "0.82rem", minHeight: "34px", padding: "0 10px" }}
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
