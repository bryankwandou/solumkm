/**
 * Data integrity fingerprint.
 *
 * Produces a SHA-256 digest over the *content* of a report. If a single figure
 * later changes, the digest changes with it — which is what lets a shop owner
 * prove their books were not edited after the fact.
 *
 * This runs locally today. Publishing the digest to a public ledger (so a third
 * party can check it independently) is the next step, not something this file
 * claims to already do.
 */

/** Stable stringify — key order must not change the digest. */
function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`);

  return `{${entries.join(",")}}`;
}

/**
 * Returns a lowercase hex SHA-256 of the payload, or null when Web Crypto is
 * unavailable (older browser, or a non-secure context). Callers must treat null
 * as "not verified yet" and show that honestly.
 */
export async function fingerprint(payload: unknown): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;

  try {
    const bytes = new TextEncoder().encode(canonical(payload));
    const digest = await subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}
