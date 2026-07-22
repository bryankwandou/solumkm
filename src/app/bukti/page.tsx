import type { Metadata } from "next";
import { ProofClient } from "@/components/proof/proof-client";

export const metadata: Metadata = {
  title: "Bukti Terverifikasi — Solumkm",
  description:
    "Cek sendiri keaslian catatan Solumkm langsung di jaringan Solana, tanpa perlu masuk. Tempel signature transaksi dan lihat sidik laporannya tercatat permanen.",
};

// A known sample anchor already written to devnet — lets any visitor (including
// jurors) see a real, verifiable record without logging in or creating data.
const SAMPLE_SIGNATURE =
  "5qE6pVArnv7HUFWGKtRMCqZ2pYDbx2SrJ8PgsL3XcUiCBbVipj4jaqRwMVNrXtqx82KpF3haGzWhWPQVzaJyHeBw";

export default function ProofPage() {
  return (
    <main className="proof-page">
      <ProofClient sampleSignature={SAMPLE_SIGNATURE} />
    </main>
  );
}
