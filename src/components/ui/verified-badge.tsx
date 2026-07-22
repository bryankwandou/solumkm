"use client";

import { useId, useState } from "react";
import { Clock3, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

export type AnchorInfo = {
  signature: string;
  cluster: string;
  explorerUrl: string;
};

type Props = {
  /** Local integrity fingerprint. Absent = not computed yet. */
  reference?: string | null;
  /** On-chain anchor, once the report has been written to devnet. */
  anchor?: AnchorInfo | null;
  /** Whether an anchoring request is in flight. */
  anchoring?: boolean;
  /** Ask the parent to anchor the current fingerprint on devnet. */
  onAnchor?: () => void;
  /** What was verified, in plain Indonesian. */
  label?: string;
};

/**
 * The trust mark.
 *
 * Surface stays plain: "Terverifikasi" once a local fingerprint exists, and an
 * optional one-tap "kunci di blockchain" that writes it to devnet. No hash,
 * wallet, or RPC jargon on the face — the signature and explorer link live
 * behind a disclosure for anyone who wants to check it independently.
 */
export function VerifiedBadge({ reference, anchor, anchoring, onAnchor, label = "catatan ini" }: Props) {
  const [open, setOpen] = useState(false);
  const detailId = useId();

  if (!reference) {
    return (
      <span className="verify-trigger" data-pending="true">
        <Clock3 aria-hidden="true" size={13} />
        Menunggu verifikasi
      </span>
    );
  }

  return (
    <div className="verify-badge">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          className="verify-trigger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={detailId}
        >
          <ShieldCheck aria-hidden="true" size={13} />
          {anchor ? "Terverifikasi di blockchain" : "Terverifikasi"}
        </button>

        {!anchor && onAnchor && (
          <button
            type="button"
            className="button button-ai"
            onClick={onAnchor}
            disabled={anchoring}
            style={{ minHeight: "32px", padding: "0 12px", fontSize: "0.78rem" }}
          >
            {anchoring ? (
              <>
                <Loader2 aria-hidden="true" size={13} className="spin" />
                Mengunci…
              </>
            ) : (
              "Kunci permanen"
            )}
          </button>
        )}
      </div>

      {open && (
        <div className="verify-detail" id={detailId} role="region" aria-label="Detail verifikasi">
          <p>
            Isi {label} dikunci dengan sidik digital. Bila angkanya diubah, sidik ini tidak akan
            cocok lagi — jadi catatanmu bisa dibuktikan apa adanya.
          </p>
          {anchor ? (
            <p style={{ margin: "0 0 8px" }}>
              Sidik ini juga sudah dicatat permanen di jaringan Solana ({anchor.cluster}) dan bisa
              dicek siapa saja:
              <br />
              <a
                href={anchor.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fine-link"
                style={{ minHeight: "auto", marginTop: "4px" }}
              >
                Lihat bukti di explorer
                <ExternalLink aria-hidden="true" size={13} />
              </a>
            </p>
          ) : (
            <p style={{ margin: "0 0 8px" }}>
              Tekan <strong>Kunci permanen</strong> untuk mencatat sidik ini ke jaringan Solana,
              supaya bisa diverifikasi pihak luar tanpa perlu percaya pada kami.
            </p>
          )}
          <code>{anchor ? anchor.signature : reference}</code>
        </div>
      )}
    </div>
  );
}
