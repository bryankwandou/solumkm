"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SolumkmMark } from "@/components/brand/solumkm-mark";

const NAV = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ai-finance", label: "Catat Transaksi" },
  { href: "/ai-marketing", label: "Buat Konten" },
];

export function SiteHeader() {
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  // Escape closes the menu — same contract as any overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Solumkm — halaman utama">
          <SolumkmMark />
          solumkm
        </Link>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>

        <div className="nav-group" id="main-nav" data-open={open}>
          <nav className="nav-links nav-menu" aria-label="Navigasi utama">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={
                  item.exact ? currentPath === item.href : currentPath.startsWith(item.href)
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav-links nav-actions" aria-label="Aksi akun">
            <Link data-active={currentPath === "/login"} href="/login">
              Masuk
            </Link>
            <Link className="button button-primary" href="/register">
              Coba Gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
