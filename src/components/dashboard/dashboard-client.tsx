"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  CheckCircle2,
  Edit3,
  Lightbulb,
  LogOut,
  Megaphone,
  PenTool,
  Plus,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { useAuthToken } from "@/hooks/use-auth";
import { logout } from "@/services/auth-client";
import { getItems, createItem, updateItem, deleteItem, ItemDTO } from "@/services/items-client";
import { requestJson, HttpError } from "@/services/http";
import { fingerprint } from "@/lib/integrity";
import { VerifiedBadge, AnchorInfo } from "@/components/ui/verified-badge";

type Transaction = {
  id: string;
  jenis: string;
  jumlah: number;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

type AIInsights = {
  ringkasan: string;
  totalPemasukan: number;
  totalPengeluaran: number;
  labaBersih: number;
  kategoriTerlaris: string;
  rekomendasi: string[];
  grafikSummary: string;
};

const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export function DashboardClient() {
  const router = useRouter();
  const { token, ready } = useAuthToken();

  // Items (produk/catatan)
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ItemDTO | null>(null);

  // Loading states
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  // AI Insights
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Integrity fingerprint over the current books. Recomputed whenever the
  // underlying transactions change, so it always describes what is on screen.
  const [reportFingerprint, setReportFingerprint] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<AnchorInfo | null>(null);
  const [anchoring, setAnchoring] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login");
    router.refresh();
  }, [router]);

  const loadItems = useCallback(async (authToken: string) => {
    setLoadingItems(true);
    setError("");
    try {
      const response = await getItems(authToken);
      setItems(response.items);
    } catch (err) {
      if (err instanceof HttpError && err.status === 401) {
        await handleLogout();
      } else if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError("Gagal memuat data produk.");
      }
    } finally {
      setLoadingItems(false);
    }
  }, [handleLogout]);

  const loadTransactions = useCallback(async (authToken: string) => {
    try {
      const data = await requestJson<{ transactions: Transaction[] }>("/api/ai/finance", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTransactions(data.transactions);
    } catch {
      // silent fail for transactions
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.push("/login");
      return;
    }
    void loadItems(token);
    void loadTransactions(token);
  }, [ready, token, router, loadItems, loadTransactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      setReportFingerprint(null);
      return;
    }
    let active = true;
    void fingerprint(
      transactions.map((t) => ({
        id: t.id,
        jenis: t.jenis,
        jumlah: t.jumlah,
        kategori: t.kategori,
        tanggal: t.tanggal,
      })),
    ).then(async (hash) => {
      if (!active) return;
      setReportFingerprint(hash);
      setAnchor(null);
      // If this exact report was already anchored on-chain, show that.
      if (hash && token) {
        try {
          const data = await requestJson<{ anchor: AnchorInfo | null }>(
            `/api/anchor?fingerprint=${hash}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (active) setAnchor(data.anchor);
        } catch {
          /* anchor lookup is best-effort */
        }
      }
    });
    return () => {
      active = false;
    };
  }, [transactions, token]);

  async function anchorReport() {
    if (!token || !reportFingerprint) return;
    setAnchoring(true);
    setError("");
    try {
      const data = await requestJson<AnchorInfo>("/api/anchor", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fingerprint: reportFingerprint }),
      });
      setAnchor(data);
    } catch (err) {
      setError(
        err instanceof HttpError ? err.message : "Gagal mengunci laporan ke blockchain. Coba lagi.",
      );
    } finally {
      setAnchoring(false);
    }
  }

  async function generateInsights() {
    if (!token) return;
    setLoadingInsights(true);
    setInsights(null);
    setError("");
    try {
      const data = await requestJson<AIInsights>("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ periode: "30 hari terakhir" }),
      });
      setInsights(data);
    } catch {
      setError("Gagal menghasilkan wawasan AI. Pastikan ada transaksi tercatat.");
    } finally {
      setLoadingInsights(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Nama produk atau catatan belum diisi.");
      return;
    }
    if (!token) {
      setError("Sesi habis. Silakan masuk ulang.");
      return;
    }

    setSaving(true);
    try {
      await createItem(token, { title: trimmedTitle, description: description.trim() });
      setTitle("");
      setDescription("");
      setFeedback("Produk berhasil disimpan!");
      await loadItems(token);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: ItemDTO) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setError("");
    setFeedback("");
  }

  async function handleUpdate(item: ItemDTO) {
    if (!token) {
      setError("Sesi habis.");
      return;
    }
    if (!editTitle.trim()) {
      setError("Judul tidak boleh kosong.");
      return;
    }
    setUpdating(true);
    try {
      await updateItem(token, item.id, { title: editTitle.trim(), description: editDescription.trim() });
      setEditingId(null);
      setFeedback("Produk berhasil diperbarui.");
      await loadItems(token);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal update.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(item: ItemDTO) {
    if (!token) return;
    setDeleting(true);
    try {
      await deleteItem(token, item.id);
      setPendingDelete(null);
      setFeedback("Produk berhasil dihapus.");
      await loadItems(token);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal menghapus.");
    } finally {
      setDeleting(false);
    }
  }

  if (!ready) {
    return (
      <div className="dashboard-loading">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  const totalPemasukan = transactions
    .filter((t) => t.jenis === "pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = transactions
    .filter((t) => t.jenis === "pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);

  return (
    <div className="dashboard-shell">
      {/* HERO */}
      <section className="dashboard-hero">
        <div>
          <p className="section-kicker">
            <Sparkles aria-hidden="true" size={13} />
            Ringkasan usaha
          </p>
          <h1>Ini kondisi usahamu hari ini.</h1>
          <p>
            Angka di bawah dihitung ulang dari transaksi yang benar-benar kamu catat — bukan
            contoh. Minta AI membacanya kapan pun kamu butuh saran.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link className="button button-primary" href="/ai-marketing">
            <Megaphone aria-hidden="true" size={17} />
            AI Marketing
          </Link>
          <Link className="button button-secondary" href="/ai-finance">
            <Wallet aria-hidden="true" size={17} />
            AI Keuangan
          </Link>
          <button type="button" className="button button-quiet" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={17} />
            Keluar
          </button>
        </div>
      </section>

      {/* RINGKASAN KEUANGAN */}
      {transactions.length > 0 && (
        <section className="metric-grid" aria-label="Ringkasan Keuangan">
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
            <span style={{ color: (totalPemasukan - totalPengeluaran) >= 0 ? "var(--verified)" : "var(--danger)" }}>
              {formatRupiah(totalPemasukan - totalPengeluaran)}
            </span>
            <p>laba bersih</p>
          </article>
        </section>
      )}

      {transactions.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <VerifiedBadge
            reference={reportFingerprint}
            anchor={anchor}
            anchoring={anchoring}
            onAnchor={anchorReport}
            label="laporan ini"
          />
        </div>
      )}

      {/* AI INSIGHTS */}
      <section className="workspace-panel" style={{ marginBottom: "18px" }}>
        <div className="panel-heading split-heading">
          <div>
            <p className="section-kicker">
              <Sparkles aria-hidden="true" size={13} />
              Wawasan AI
            </p>
            <h2>Apa kata AI tentang usahamu?</h2>
          </div>
          <button
            className="button button-ai"
            onClick={generateInsights}
            disabled={loadingInsights}
          >
            <Sparkles aria-hidden="true" size={17} />
            {loadingInsights ? "Menganalisis..." : insights ? "Analisis Ulang" : "Lihat Wawasan"}
          </button>
        </div>

        {error && (
          <div className="alert error" role="alert">
            <AlertTriangle aria-hidden="true" size={18} />
            <span>{error}</span>
          </div>
        )}

        {loadingInsights && (
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" style={{ height: "96px" }} />
          </div>
        )}

        {insights && !loadingInsights && (
          <div style={{ display: "grid", gap: "12px", marginTop: "8px" }}>
            <div className="ai-panel">
              <h3>
                <Sparkles aria-hidden="true" size={16} />
                Apa yang AI lihat
              </h3>
              <p style={{ margin: 0, fontSize: "1.02rem" }}>{insights.ringkasan}</p>

              <div className="ai-figures">
                <div>
                  <small>Pemasukan</small>
                  <strong>{formatRupiah(insights.totalPemasukan)}</strong>
                </div>
                <div>
                  <small>Pengeluaran</small>
                  <strong style={{ color: "var(--danger)" }}>
                    {formatRupiah(insights.totalPengeluaran)}
                  </strong>
                </div>
                <div>
                  <small>Laba bersih</small>
                  <strong style={{ color: insights.labaBersih >= 0 ? "var(--verified)" : "var(--danger)" }}>
                    {formatRupiah(insights.labaBersih)}
                  </strong>
                </div>
              </div>

              <p style={{ margin: "14px 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>
                {insights.grafikSummary} · Kategori terlaris: {insights.kategoriTerlaris}
              </p>
            </div>

            <div className="item-card">
              <h3>Yang sebaiknya kamu lakukan</h3>
              <ul className="rec-list">
                {insights.rekomendasi.map((rec) => (
                  <li key={rec}>
                    <Lightbulb aria-hidden="true" size={15} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!insights && !loadingInsights && !error && (
          <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>
            Klik &ldquo;Lihat Wawasan&rdquo; dan AI akan membaca transaksimu, lalu memberi tahu apa
            yang naik, apa yang turun, dan apa yang perlu kamu lakukan.
          </p>
        )}
      </section>

      {/* PRODUK / CATATAN */}
      <div className="dashboard-grid">
        <section className="workspace-panel">
          <div className="panel-heading">
            <p className="section-kicker">Input Data</p>
            <h2>Tambah produk atau catatan.</h2>
          </div>

          <form className="form-panel" onSubmit={handleCreate} noValidate aria-busy={saving}>
            <div className="field-group">
              <label htmlFor="item-title">Nama Produk / Catatan</label>
              <input
                id="item-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Kue Kering Nastar, Jasa Jahit Baju"
              />
            </div>

            <div className="field-group">
              <label htmlFor="item-description">Deskripsi</label>
              <textarea
                id="item-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Detail produk, harga, atau catatan penting."
              />
            </div>

            {feedback && (
              <div className="alert success" role="status">
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>{feedback}</span>
              </div>
            )}

            <button className="button button-primary full-width" type="submit" disabled={saving}>
              <Plus aria-hidden="true" size={18} />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </section>

        <section className="workspace-panel">
          <div className="panel-heading split-heading">
            <div>
              <p className="section-kicker">Katalog Produk</p>
              <h2>Daftar produk & catatan.</h2>
            </div>
          </div>

          {loadingItems ? (
            <div className="items-list" aria-label="Memuat data">
              {[0, 1, 2].map((item) => (
                <div className="item-card" key={item}>
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-text" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <BarChart3 aria-hidden="true" size={28} />
              <h3>Belum ada produk tercatat.</h3>
              <p>Tambahkan produk pertamamu dari form di sebelah kiri.</p>
            </div>
          ) : (
            <ul className="items-list" aria-label="Daftar produk">
              {items.map((item) => (
                <li key={item.id} className="item-card">
                  {editingId === item.id ? (
                    <div className="edit-panel">
                      <label htmlFor={`edit-title-${item.id}`}>Judul</label>
                      <input
                        id={`edit-title-${item.id}`}
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />
                      <label htmlFor={`edit-description-${item.id}`}>Deskripsi</label>
                      <textarea
                        id={`edit-description-${item.id}`}
                        rows={3}
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />
                      <div className="button-row">
                        <button
                          type="button"
                          className="button button-primary"
                          onClick={() => handleUpdate(item)}
                          disabled={updating}
                        >
                          {updating ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button type="button" className="button button-secondary" onClick={() => setEditingId(null)}>
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-card-head">
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.description || "Belum ada deskripsi."}</p>
                        </div>
                        <span>{new Date(item.updatedAt).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="button-row">
                        <button type="button" className="button button-secondary" onClick={() => startEdit(item)}>
                          <Edit3 aria-hidden="true" size={16} />
                          Edit
                        </button>
                        <button type="button" className="button button-danger" onClick={() => setPendingDelete(item)}>
                          <Trash2 aria-hidden="true" size={16} />
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* DELETE CONFIRM DIALOG */}
      {pendingDelete && (
        <div className="dialog-backdrop" role="presentation">
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <AlertTriangle aria-hidden="true" size={22} />
            <h2 id="delete-title">Hapus produk ini?</h2>
            <p>
              <strong>{pendingDelete.title}</strong> akan dihapus permanen.
            </p>
            <div className="button-row">
              <button
                type="button"
                className="button button-danger"
                onClick={() => handleDelete(pendingDelete)}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Ya, hapus"}
              </button>
              <button type="button" className="button button-secondary" onClick={() => setPendingDelete(null)}>
                Batal
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
