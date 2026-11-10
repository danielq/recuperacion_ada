"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Grade = {
  id: string;
  full_name: string;
  started_at: string;
  finished_at: string | null;
  score_points: number | null;
  score_grade: number | null;
  total_questions: number;
  correct_count: number;
  answered_count: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [admin, setAdmin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/grades");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        setLoading(false);
        return;
      }
      setGrades(data.grades);
      setAdmin(data.admin);
      setLoading(false);
    }
    load();
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function downloadExcel() {
    const rows = grades.map((g) => ({
      Nombre: g.full_name,
      Inicio: g.started_at ? new Date(g.started_at).toLocaleString("es-CO") : "",
      Fin: g.finished_at ? new Date(g.finished_at).toLocaleString("es-CO") : "En curso",
      Respondidas: g.answered_count,
      Aciertos: g.correct_count,
      Puntos: g.score_points ?? "",
      Nota: g.score_grade ?? "",
      Estado: g.finished_at ? "Finalizado" : "Incompleto",
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Notas");
    XLSX.writeFile(book, "notas-recuperacion-ada.xlsx");
  }

  function downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Notas — Taller Recuperación Big O / Ω / Θ", 14, 16);
    doc.setFontSize(10);
    doc.text(`Admin: ${admin} · Generado: ${new Date().toLocaleString("es-CO")}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Nombre", "Fin", "Aciertos", "Puntos", "Nota", "Estado"]],
      body: grades.map((g) => [
        g.full_name,
        g.finished_at ? new Date(g.finished_at).toLocaleString("es-CO") : "—",
        String(g.correct_count),
        g.score_points == null ? "—" : String(g.score_points),
        g.score_grade == null ? "—" : String(g.score_grade),
        g.finished_at ? "Finalizado" : "Incompleto",
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("notas-recuperacion-ada.pdf");
  }

  if (loading) {
    return <main className="p-10 text-center">Cargando panel…</main>;
  }

  return (
    <main className="mx-auto max-w-6xl py-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--uv-ink)]">Calificaciones</h1>
          <p className="text-sm text-[var(--uv-muted)]">
            Universidad del Valle · Sesión: {admin}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadExcel}
            className="rounded-lg bg-[var(--uv-ink)] px-3 py-2 text-sm font-medium text-white"
          >
            Descargar Excel
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="rounded-lg bg-[var(--uv-red)] px-3 py-2 text-sm font-medium text-white"
          >
            Descargar PDF
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[var(--uv-border)] px-3 py-2 text-sm"
          >
            Salir
          </button>
        </div>
      </header>

      {error ? <p className="mb-4 text-rose-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Aciertos</th>
              <th className="px-4 py-3">Puntos</th>
              <th className="px-4 py-3">Nota /5</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Aún no hay intentos.
                </td>
              </tr>
            ) : (
              grades.map((g) => (
                <tr key={g.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{g.full_name}</td>
                  <td className="px-4 py-3">
                    {new Date(g.started_at).toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    {g.finished_at
                      ? new Date(g.finished_at).toLocaleString("es-CO")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{g.correct_count}</td>
                  <td className="px-4 py-3">{g.score_points ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold">
                    {g.score_grade ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {g.finished_at ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                        Finalizado
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        Incompleto
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
