# Brand — Solumkm

_Status: active — derived from PLANNING.md §8, adjusted for the "AI first, verification second" pivot._

## Positioning

**Solumkm adalah AI Business Copilot untuk UMKM.**
Setiap catatan bisnis penting dapat diverifikasi agar datanya tidak bisa diubah diam-diam.

- **AI is the product.** Everything a user sees leads with what the AI *did for them*.
- **Verification is the trust layer.** It appears as a green "Terverifikasi" mark, never as a hash, wallet, RPC, or network name in the primary UI.
- Tagline: _"Usaha kecil naik kelas. Tanpa ribet."_

## Voice

Hangat, memberdayakan, tidak menggurui. Bahasa Indonesia sehari-hari.
Kalimat pendek. Aktif. Tanpa jargon teknis di permukaan.

| Jangan tulis | Tulis |
|---|---|
| Transaction hash disimpan ke Solana Devnet | Catatan ini sudah terverifikasi |
| Connect your wallet to continue | (tidak ada — wallet bersifat opsional dan tersembunyi) |
| Generate AI-powered content | Buatkan caption |
| Data berhasil disubmit ke sistem | Sudah tercatat |

## Color tokens

Base is a stark, near-neutral light surface — it reads professional to a non-crypto audience.
Exactly two accents carry meaning, and each has one job.

| Token | Value | Job |
|---|---|---|
| `--foreground` | `#0B0E14` | Text, primary buttons |
| `--background` | `#F6F7F9` | Page |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--muted` | `#5C6675` | Secondary text (AA on surface) |
| `--line` | `#DEE2E9` | Borders |
| `--ai` | `#7C3AED` | **AI only.** Copilot messages, generated output, insight cards |
| `--ai-soft` | `#F2ECFF` | AI surface tint |
| `--verified` | `#0E8F62` | **Verification only.** The "Terverifikasi" mark |
| `--verified-soft` | `#E4F5EE` | Verification surface tint |
| `--danger` | `#C2273C` | Errors, expenses, destructive |

Rule: purple never means "success", green never means "AI". If a color is doing two jobs, it is wrong.

## Typography

- **Display + body:** Plus Jakarta Sans (via `next/font/google`) — friendly geometric, reads well in Bahasa Indonesia at small sizes.
- **Numbers + IDs:** JetBrains Mono — money figures and any technical string.
- Headings run tight (`line-height: 1.04`) and heavy (`760–820`). Body stays `1.55` for readability on phones.

## Layout

Mobile-first. Every screen must be usable at 375 px with one thumb.
Hit targets ≥ 44 px. Content column caps at 1180 px.

## Motion

Entrances only, and only once. Spring, 120/20. Everything wrapped in
`prefers-reduced-motion`. No looping animation near text.
