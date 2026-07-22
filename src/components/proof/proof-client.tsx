"use client";

import { useCallback, useEffect, useState } from "react";

type VerifyOk = {
  verified: true;
  fingerprint: string;
  memo: string;
  slot: number;
  blockTime: number | null;
  signer: string | null;
  explorerUrl: string;
};
type VerifyFail = { verified: false; reason: string };
type VerifyState = VerifyOk | VerifyFail | null;

function formatTime(blockTime: number | null): string {
  if (!blockTime) return "waktu tidak tersedia";
  return new Date(blockTime * 1000).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function ProofClient({ sampleSignature }: { sampleSignature: string }) {
  const [input, setInput] = useState(sampleSignature);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyState>(null);

  const verify = useCallback(async (signature: string) => {
    const sig = signature.trim();
    if (!sig) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/verify?signature=${encodeURIComponent(sig)}`);
      const data = (await res.json()) as VerifyState;
      setResult(data);
    } catch {
      setResult({ verified: false, reason: "Gagal menghubungi jaringan. Coba lagi." });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-verify the sample so a first-time visitor immediately sees a real proof.
  useEffect(() => {
    void verify(sampleSignature);
  }, [verify, sampleSignature]);

  return (
    <section className="proof-shell">
      <header className="proof-head">
        <span className="proof-eyebrow">Bukti publik</span>
        <h1>Cek sendiri keaslian catatannya.</h1>
        <p>
          Setiap laporan yang dikunci di Solumkm meninggalkan sidik permanen di
          jaringan Solana. Tempel signature transaksi di bawah, dan halaman ini
          membacanya langsung dari jaringan, bukan dari database kami. Tidak perlu
          masuk.
        </p>
      </header>

      <form
        className="proof-form"
        onSubmit={(e) => {
          e.preventDefault();
          void verify(input);
        }}
      >
        <label htmlFor="sig">Signature transaksi (devnet)</label>
        <div className="proof-input-row">
          <input
            id="sig"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tempel signature Solana di sini"
            spellCheck={false}
            autoComplete="off"
          />
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Memeriksa…" : "Periksa"}
          </button>
        </div>
      </form>

      <div className="proof-result" aria-live="polite">
        {loading && <p className="proof-muted">Membaca jaringan Solana…</p>}

        {result && result.verified && (
          <div className="proof-card proof-ok">
            <div className="proof-badge">✓ Terverifikasi di jaringan Solana</div>
            <dl>
              <div>
                <dt>Sidik laporan (SHA-256)</dt>
                <dd className="proof-mono">{result.fingerprint}</dd>
              </div>
              <div>
                <dt>Memo on-chain</dt>
                <dd className="proof-mono">{result.memo}</dd>
              </div>
              <div>
                <dt>Waktu tercatat</dt>
                <dd>{formatTime(result.blockTime)}</dd>
              </div>
              <div>
                <dt>Slot</dt>
                <dd className="proof-mono">{result.slot.toLocaleString("id-ID")}</dd>
              </div>
              {result.signer && (
                <div>
                  <dt>Pencatat</dt>
                  <dd className="proof-mono">{result.signer}</dd>
                </div>
              )}
            </dl>
            <a
              className="proof-explorer"
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka di Solana Explorer →
            </a>
          </div>
        )}

        {result && !result.verified && (
          <div className="proof-card proof-fail">
            <div className="proof-badge proof-badge-fail">Belum terverifikasi</div>
            <p>{result.reason}</p>
          </div>
        )}
      </div>

      <ol className="proof-how">
        <li>Sidik SHA-256 dihitung dari isi laporan.</li>
        <li>Sidik itu ditulis ke jaringan Solana sebagai memo permanen.</li>
        <li>Siapa pun bisa membacanya kembali dan mencocokkannya, tanpa mempercayai kami.</li>
      </ol>
    </section>
  );
}
