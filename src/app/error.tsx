"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SolumkmMark } from "@/components/brand/solumkm-mark";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <SolumkmMark size={40} />
      <p className="status-code">Ups</p>
      <h1>Ada yang tersendat sebentar.</h1>
      <p className="status-lead">
        Sistem sedang bermasalah saat memuat halaman ini. Coba muat ulang, biasanya
        langsung pulih. Kalau masih berlanjut, kembali ke beranda dulu.
      </p>
      <div className="status-actions">
        <button className="button button-primary" onClick={() => reset()}>
          Coba lagi
        </button>
        <Link className="button" href="/">
          Ke beranda
        </Link>
      </div>
    </main>
  );
}
