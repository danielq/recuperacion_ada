"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar");
        return;
      }
      router.push(`/taller/${data.attemptId}`);
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-xl flex-col justify-center py-6">
      <div className="rounded-2xl border border-[var(--uv-border)] bg-white p-8 shadow-md">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--uv-red)]">
          ADA · Recuperación
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--uv-ink)]">
          Taller Big O, Ω y Θ
        </h1>
        <p className="mt-3 text-[var(--uv-muted)]">
          Escribe tus <strong className="text-[var(--uv-ink)]">nombres y apellidos
          completos</strong>{" "}
          para presentar. Cada respuesta se califica al instante y{" "}
          <strong className="text-[var(--uv-ink)]">no se puede modificar</strong>.
        </p>

        <form onSubmit={start} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-[var(--uv-ink)]">
            Nombres y apellidos
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Ana María López Ruiz"
              className="mt-1 w-full rounded-xl border border-[var(--uv-border)] px-4 py-3 outline-none focus:border-[var(--uv-red)] focus:ring-2 focus:ring-[var(--uv-red)]/20"
              required
            />
          </label>
          {error ? <p className="text-sm text-[var(--uv-red)]">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--uv-red)] px-4 py-3 font-semibold text-white hover:bg-[var(--uv-red-dark)] disabled:opacity-60"
          >
            {loading ? "Iniciando…" : "Comenzar taller"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--uv-muted)]">
          Docente:{" "}
          <Link
            href="/admin/login"
            className="font-semibold text-[var(--uv-red)] underline hover:text-[var(--uv-red-dark)]"
          >
            acceso administración
          </Link>
        </p>
      </div>
    </main>
  );
}
