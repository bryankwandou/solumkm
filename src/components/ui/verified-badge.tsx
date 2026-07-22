"use client";

import { useId, useState } from "react";
import { Clock3, ShieldCheck } from "lucide-react";

type Props = {
  /** Verification reference for this record. Absent = not verified yet. */
  reference?: string | null;
  /** What was verified, in plain Indonesian. Shown when expanded. */
  label?: string;
};

/**
 * The trust mark.
 *
 * Deliberately shows only "Terverifikasi" on the surface — no hash, no wallet,
 * no network name, no "devnet". A shop owner should never have to read those
 * words to trust the record. The technical reference stays one click away for
 * anyone who wants to check it.
 */
export function VerifiedBadge({ reference, label = "catatan ini" }: Props) {
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
      <button
        type="button"
        className="verify-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailId}
      >
        <ShieldCheck aria-hidden="true" size={13} />
        Terverifikasi
      </button>

      {open && (
        <div className="verify-detail" id={detailId} role="region" aria-label="Detail verifikasi">
          <p>
            Isi {label} sudah dikunci dengan sidik digital. Kalau nanti ada yang mengubah
            angkanya, sidik ini tidak akan cocok lagi — jadi catatanmu bisa dibuktikan apa adanya.
          </p>
          <code>{reference}</code>
        </div>
      )}
    </div>
  );
}
