import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Solumkm: Asisten Bisnis Ber-AI untuk UMKM Indonesia",
  description:
    "Catat penjualan pakai bahasa sehari-hari, diketik atau diucapkan. AI merapikan pembukuan dan memberi saran bisnis, dan catatan penting bisa dikunci supaya tidak bisa diubah diam-diam.",
  applicationName: "Solumkm",
  keywords: ["UMKM", "AI", "pembukuan", "asisten bisnis", "Indonesia"],
  // Required by Dicoding to verify ownership of a Web-platform submission.
  other: { "dicoding:email": "wall.breaker.king.commander@gmail.com" },
  openGraph: {
    title: "Solumkm: Asisten Bisnis Ber-AI untuk UMKM",
    description: "Usaha kecil naik kelas. Tanpa ribet.",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
