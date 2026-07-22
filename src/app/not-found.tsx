import Link from "next/link";
import { SolumkmMark } from "@/components/brand/solumkm-mark";

export default function NotFound() {
  return (
    <main className="status-page">
      <SolumkmMark size={40} />
      <p className="status-code">404</p>
      <h1>Halamannya tidak ketemu.</h1>
      <p className="status-lead">
        Mungkin tautannya salah ketik atau halamannya sudah pindah. Yuk kembali ke
        beranda dan mulai dari sana.
      </p>
      <div className="status-actions">
        <Link className="button button-primary" href="/">
          Ke beranda
        </Link>
        <Link className="button" href="/dashboard">
          Buka dashboard
        </Link>
      </div>
    </main>
  );
}
