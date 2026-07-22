"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Megaphone, RefreshCw, Share2, Sparkles } from "lucide-react";
import { useAuthToken } from "@/hooks/use-auth";
import { requestJson, HttpError } from "@/services/http";

type AIMarketingResult = {
  caption: string;
  hashtags: string[];
  deskripsiSingkat: string;
  ajakan: string;
};

export function MarketingClient() {
  const router = useRouter();
  const { token, ready } = useAuthToken();

  const [namaProduk, setNamaProduk] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("santai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIMarketingResult | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (ready && !token) {
      router.push("/login");
    }
  }, [ready, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setResult(null);
    setCopied("");

    if (!namaProduk.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const data = await requestJson<AIMarketingResult>("/api/ai/marketing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ namaProduk: namaProduk.trim(), platform, tone }),
      });
      setResult(data);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError("Gagal menghasilkan konten. Periksa koneksi internetmu.");
      }
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const shareToWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

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
              Buat konten
            </p>
            <h1>Promosi jadi, tanpa bingung mau nulis apa.</h1>
            <p>
              Sebut nama produkmu, pilih tempat posting dan gaya bahasanya. AI menuliskan caption,
              hashtag, deskripsi, dan ajakan yang tinggal kamu tempel.
            </p>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* FORM */}
          <section className="workspace-panel">
            <div className="panel-heading">
              <p className="section-kicker">Input Produk</p>
              <h2>Isi detail produkmu.</h2>
            </div>

            <form className="form-panel" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="nama-produk">Nama Produk / Jasa</label>
                <input
                  id="nama-produk"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  placeholder="Contoh: Nasi Goreng Special, Tas Rajut, Jasa Cuci Motor"
                />
              </div>

              <div className="field-group">
                <label htmlFor="platform">Platform Tujuan</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="shopee">Shopee</option>
                  <option value="tokopedia">Tokopedia</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="tone">Gaya Bahasa</label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="santai">Santai & Friendly</option>
                  <option value="semangat">Semangat & Energik</option>
                  <option value="formal">Formal & Profesional</option>
                </select>
              </div>

              {error && (
                <div className="alert error" role="alert">
                  {error}
                </div>
              )}

              <button className="button button-primary full-width" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 aria-hidden="true" size={18} className="spin" />
                    AI sedang bikin konten...
                  </>
                ) : (
                  <>
                    <Sparkles aria-hidden="true" size={18} />
                    Buatkan Konten
                  </>
                )}
              </button>
            </form>
          </section>

          {/* RESULT */}
          <section className="workspace-panel">
            <div className="panel-heading split-heading">
              <div>
                <p className="section-kicker">Hasil AI</p>
                <h2>Konten siap pakai.</h2>
              </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setResult(null)}
                disabled={!result}
              >
                <RefreshCw aria-hidden="true" size={16} />
                Reset
              </button>
            </div>

            {!result && !loading && (
              <div className="empty-state">
                <Megaphone aria-hidden="true" size={28} />
                <h3>Kontenmu akan muncul di sini.</h3>
                <p>Isi nama produk di sebelah kiri, lalu klik &ldquo;Buatkan Konten&rdquo;.</p>
              </div>
            )}

            {result && (
              <div style={{ display: "grid", gap: "14px" }}>
                {/* Caption */}
                <div className="item-card">
                  <div className="item-card-head">
                    <h3>📝 Caption</h3>
                    <div className="button-row">
                      <button className="button button-secondary" onClick={() => copyToClipboard(result.caption, "caption")}>
                        <Copy size={14} />
                        {copied === "caption" ? " Tersalin" : " Copy"}
                      </button>
                      <button className="button button-secondary" onClick={() => shareToWhatsApp(result.caption)}>
                        <Share2 size={14} />
                        {" WA"}
                      </button>
                    </div>
                  </div>
                  <p style={{ whiteSpace: "pre-wrap", color: "var(--foreground)" }}>{result.caption}</p>
                </div>

                {/* Hashtags */}
                <div className="item-card">
                  <h3>🏷️ Hashtags</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {result.hashtags.map((tag) => (
                      <span key={tag} className="badge badge-ai">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="button button-secondary"
                    style={{ marginTop: "8px" }}
                    onClick={() => copyToClipboard(result.hashtags.join(" "), "hashtags")}
                  >
                    <Copy size={14} />
                    {copied === "hashtags" ? " Tersalin" : " Copy Semua"}
                  </button>
                </div>

                {/* Deskripsi */}
                <div className="item-card">
                  <h3>📋 Deskripsi Singkat</h3>
                  <p style={{ color: "var(--foreground)", marginTop: "4px" }}>{result.deskripsiSingkat}</p>
                </div>

                {/* Ajakan */}
                <div className="ai-panel">
                  <h3>
                    <Sparkles aria-hidden="true" size={16} />
                    Ajakan penutup
                  </h3>
                  <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{result.ajakan}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
