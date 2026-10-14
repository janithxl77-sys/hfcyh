"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Invalid credentials");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Sign in to manage portfolio projects.</p>

        <div className="mt-6 space-y-3">
          <input className="input-base" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            className="input-base"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-black">
            {loading ? "Signing in..." : "Login"}
          </button>
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>
      </form>
    </main>
  );
}
