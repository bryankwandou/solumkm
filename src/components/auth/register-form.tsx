"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserPlus } from "lucide-react";
import { requestJson, HttpError } from "@/services/http";
import { AUTH_TOKEN_KEY } from "@/constants/auth";

type RegisterResponse = {
  message: string;
  token: string;
  user: { id: string; email: string };
};

export function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailInvalid = email.trim().length > 0 && !email.includes("@");
  const passwordInvalid = password.trim().length > 0 && password.trim().length < 6;
  const confirmMismatch = confirmPassword.trim().length > 0 && password !== confirmPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Lengkapi semua kolom sebelum membuat akun.");
      return;
    }
    if (emailInvalid) {
      setError("Email perlu memakai format yang benar.");
      return;
    }
    if (passwordInvalid) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (confirmMismatch) {
      setError("Konfirmasi sandi belum sama.");
      return;
    }

    setLoading(true);
    try {
      const result = await requestJson<RegisterResponse>("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Akun belum bisa dibuat. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate aria-busy={loading}>
      <div className="auth-card-head">
        <span className="auth-mark">
          <UserPlus aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="section-kicker">Daftar Gratis</p>
          <h1>Mulai dari satu transaksi.</h1>
          <p>
            Cukup email dan kata sandi. Setelah itu kamu bisa langsung mencatat, dan laporanmu jadi
            dengan sendirinya.
          </p>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="register-email">Email</label>
        <div className="input-shell">
          <Mail aria-hidden="true" size={18} />
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={emailInvalid}
            placeholder="nama@email.com"
          />
        </div>
        {emailInvalid && <p className="error-note">Email perlu memuat tanda @.</p>}
      </div>

      <div className="field-group">
        <label htmlFor="register-password">Kata sandi</label>
        <div className="input-shell">
          <LockKeyhole aria-hidden="true" size={18} />
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={passwordInvalid}
            placeholder="minimal 6 karakter"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordInvalid && <p className="error-note">Kata sandi minimal 6 karakter.</p>}
      </div>

      <div className="field-group">
        <label htmlFor="register-confirm-password">Ulangi kata sandi</label>
        <div className="input-shell">
          <LockKeyhole aria-hidden="true" size={18} />
          <input
            id="register-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={confirmMismatch}
            placeholder="ketik ulang sandi"
          />
        </div>
        {confirmMismatch && <p className="error-note">Belum sama dengan sandi pertama.</p>}
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}

      <button className="button button-primary full-width" type="submit" disabled={loading}>
        {loading ? "Membuat akun..." : "Daftar & Mulai"}
      </button>

      <p className="auth-switch">
        Sudah punya akun? <Link href="/login">Masuk di sini</Link>
      </p>
    </form>
  );
}
