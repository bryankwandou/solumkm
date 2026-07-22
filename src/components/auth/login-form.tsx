"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { login } from "@/services/auth-client";
import { HttpError } from "@/services/http";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailInvalid = email.trim().length > 0 && !email.includes("@");
  const passwordInvalid = password.trim().length > 0 && password.trim().length < 6;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setError("");

    if (!email || !password) {
      setError("Isi email dan kata sandi lebih dulu.");
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

    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Login belum berhasil. Coba lagi setelah beberapa saat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate aria-busy={loading}>
      <div className="auth-card-head">
        <span className="auth-mark">
          <Sparkles aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="section-kicker">Masuk ke Solumkm</p>
          <h1>Lanjutkan mengurus usahamu.</h1>
          <p>Catatan, laporan, dan saran AI-mu menunggu di dalam.</p>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="login-email">Email</label>
        <div className="input-shell">
          <Mail aria-hidden="true" size={18} />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={emailInvalid}
            aria-describedby={emailInvalid ? "login-email-error" : undefined}
            placeholder="nama@email.com"
          />
        </div>
        {emailInvalid && (
          <p className="error-note" id="login-email-error">Email perlu memuat tanda @.</p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="login-password">Kata sandi</label>
        <div className="input-shell">
          <LockKeyhole aria-hidden="true" size={18} />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            spellCheck={false}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={passwordInvalid}
            aria-describedby={passwordInvalid ? "login-password-error" : undefined}
            placeholder="minimal 6 karakter"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
          </button>
        </div>
        {passwordInvalid && (
          <p className="error-note" id="login-password-error">Kata sandi minimal 6 karakter.</p>
        )}
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}

      <button className="button button-primary full-width" type="submit" disabled={loading}>
        {loading ? "Memeriksa akun..." : "Masuk ke Dashboard"}
      </button>

      {submitted && !error && loading && <p className="form-hint">Token sedang diminta dari server.</p>}

      <p className="auth-switch">
        Belum punya akun? <Link href="/register">Daftar gratis</Link>
      </p>
    </form>
  );
}
