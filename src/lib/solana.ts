import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";

/**
 * Solana devnet anchoring for report integrity fingerprints.
 *
 * A report's SHA-256 fingerprint (see lib/integrity.ts) is written into a
 * devnet transaction via the Memo program. Because the transaction is signed
 * and timestamped by the chain, anyone can later confirm that a report with
 * that exact fingerprint existed at that time and has not been altered since —
 * without trusting our database. This is the "verifiable business record" the
 * product promises, and it runs on real devnet, not a mock.
 */

// SPL Memo program — standard address across all clusters.
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const RPC_URL = process.env.SOLANA_RPC_URL ?? clusterApiUrl("devnet");

let cachedSigner: Keypair | null = null;

/**
 * Loads the devnet signer from SOLANA_SECRET_KEY. Tolerates the three common
 * export formats so it works with whatever the wallet produced:
 *   - JSON array of 64 bytes (Solana CLI keygen)
 *   - base58 64-byte secret key (Phantom / Solflare export)
 *   - 64-char hex seed (32 bytes)
 * Returns null when unset so anchoring degrades gracefully.
 */
function getSigner(): Keypair | null {
  if (cachedSigner) return cachedSigner;
  const raw = process.env.SOLANA_SECRET_KEY?.trim();
  if (!raw) return null;

  try {
    if (raw.startsWith("[")) {
      cachedSigner = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
    } else if (/^[0-9a-f]{64}$/i.test(raw)) {
      // Hex seed → 32 bytes → ed25519 keypair.
      const seed = Uint8Array.from(raw.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
      cachedSigner = Keypair.fromSeed(seed);
    } else {
      // base58-encoded 64-byte secret key.
      cachedSigner = Keypair.fromSecretKey(bs58.decode(raw));
    }
  } catch (error) {
    console.error("Invalid SOLANA_SECRET_KEY:", error);
    return null;
  }
  return cachedSigner;
}

export type AnchorResult =
  | { ok: true; signature: string; cluster: "devnet"; explorerUrl: string }
  | { ok: false; reason: string };

/**
 * Writes `fingerprint` to devnet as a memo and returns the confirmed signature.
 * Never throws — callers get a structured failure they can surface honestly.
 */
export async function anchorFingerprint(fingerprint: string): Promise<AnchorResult> {
  const signer = getSigner();
  if (!signer) return { ok: false, reason: "Penandatangan on-chain belum dikonfigurasi." };
  if (!/^[a-f0-9]{64}$/i.test(fingerprint)) {
    return { ok: false, reason: "Sidik digital tidak valid." };
  }

  try {
    const connection = new Connection(RPC_URL, "confirmed");
    const memo = `solumkm:v1:${fingerprint}`;

    const tx = new Transaction().add(
      // A zero-lamport self-transfer keeps the tx valid while the memo carries
      // the payload; the memo instruction itself holds the fingerprint.
      SystemProgram.transfer({ fromPubkey: signer.publicKey, toPubkey: signer.publicKey, lamports: 0 }),
      {
        keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf8"),
      },
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = signer.publicKey;
    tx.sign(signer);

    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    return {
      ok: true,
      signature,
      cluster: "devnet",
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    };
  } catch (error) {
    console.error("Solana anchor failed:", error);
    const reason = error instanceof Error ? error.message : "Gagal menulis ke jaringan.";
    return { ok: false, reason };
  }
}
