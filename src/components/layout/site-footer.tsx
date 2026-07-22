import Link from "next/link";
import { SolumkmMark } from "@/components/brand/solumkm-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <Link href="/" className="brand" aria-label="Solumkm — halaman utama">
          <SolumkmMark size={22} />
          solumkm
        </Link>
        <p style={{ margin: 0 }}>
          Usaha kecil naik kelas. Tanpa ribet. · Dibangun untuk IDCamp Developer Challenge #2
        </p>
      </div>
    </footer>
  );
}
