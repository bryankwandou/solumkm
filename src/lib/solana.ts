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

export type VerifyResult =
  | {
      ok: true;
      fingerprint: string;
      memo: string;
      slot: number;
      blockTime: number | null;
      signer: string | null;
      explorerUrl: string;
    }
  | { ok: false; reason: string };

/**
 * Reads a devnet transaction back from the chain and confirms it carries a
 * genuine Solumkm anchor memo (`solumkm:v1:<sha256>`). This powers the public
 * proof page: anyone — no login — can paste a signature and see that the
 * fingerprint really lives on Solana, verified against the live network rather
 * than our own database.
 */
export async function verifyMemo(signature: string): Promise<VerifyResult> {
  const sig = signature.trim();
  // base58 signatures are 87–88 chars; guard before hitting the network.
  if (!/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(sig)) {
    return { ok: false, reason: "Format signature tidak valid." };
  }

  try {
    const connection = new Connection(RPC_URL, "confirmed");
    const tx = await connection.getTransaction(sig, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });
    if (!tx) return { ok: false, reason: "Transaksi tidak ditemukan di devnet." };

    // The memo text surfaces in the transaction log messages as
    // 'Program log: Memo (len N): "solumkm:v1:<hash>"'.
    const logs = tx.meta?.logMessages ?? [];
    const memoLine = logs.find((l) => l.includes("solumkm:v1:"));
    const match = memoLine?.match(/solumkm:v1:([a-f0-9]{64})/i);
    if (!match) {
      return { ok: false, reason: "Transaksi ini bukan anchor Solumkm yang sah." };
    }

    const signer =
      tx.transaction.message.getAccountKeys().staticAccountKeys[0]?.toBase58() ?? null;

    return {
      ok: true,
      fingerprint: match[1].toLowerCase(),
      memo: `solumkm:v1:${match[1].toLowerCase()}`,
      slot: tx.slot,
      blockTime: tx.blockTime ?? null,
      signer,
      explorerUrl: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
    };
  } catch (error) {
    console.error("Solana verify failed:", error);
    const reason = error instanceof Error ? error.message : "Gagal membaca jaringan.";
    return { ok: false, reason };
  }
}
