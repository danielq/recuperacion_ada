"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("daniel.quintero");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login fallido");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col justify-center py-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-[var(--uv-border)] border-t-4 border-t-[var(--uv-red)] bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-[var(--uv-ink)]">
          Admin · Recuperación ADA
        </h1>
        <p className="mt-1 text-sm text-[var(--uv-muted)]">
          Universidad del Valle · Solo docente
        </p>

        <label className="mt-6 block text-sm font-medium">
          Usuario
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Contraseña
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[var(--uv-red)] py-3 font-semibold text-white hover:bg-[var(--uv-red-dark)] disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <Link href="/" className="mt-4 block text-center text-sm underline">
          Volver
        </Link>
      </form>
    </main>
  );
}
