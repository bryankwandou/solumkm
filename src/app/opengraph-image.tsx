import { ImageResponse } from "next/og";

// Social preview card shown when solumkm.vercel.app is shared.
export const runtime = "edge";
export const alt = "Solumkm — AI Business Copilot untuk UMKM Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0b1220 0%, #12203a 55%, #1b1533 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #0E8F62 0%, #1FA97D 55%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            📈
          </div>
          <div style={{ color: "#ffffff", fontSize: 40, fontWeight: 700 }}>solumkm</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#ffffff", fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 940 }}>
            AI Business Copilot untuk UMKM Indonesia
          </div>
          <div style={{ color: "#9fb0c7", fontSize: 32, lineHeight: 1.3, maxWidth: 900 }}>
            Cerita transaksimu, AI yang merapikan pembukuan, menganalisis, dan membuat konten.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Generative AI", "Data real-time", "Terverifikasi on-chain"].map((tag) => (
            <div
              key={tag}
              style={{
                color: "#d6e0ee",
                fontSize: 26,
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
