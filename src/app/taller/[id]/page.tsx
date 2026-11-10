"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DragQuestion from "@/components/DragQuestion";
import AntiCheat from "@/components/AntiCheat";

type Q = {
  id: string;
  section: string;
  prompt: string;
  code?: string;
  options: { id: string; label: string }[];
  points: number;
};

type AnswerState = {
  selectedValue: string;
  isCorrect: boolean;
};

export default function TallerPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = String(params.id);

  const [fullName, setFullName] = useState("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{
    score_points: number;
    score_grade: number;
    totalPoints: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/attempts/${attemptId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "No se pudo cargar");
          return;
        }
        setFullName(data.attempt.full_name);
        setQuestions(data.questions);
        const map: Record<string, AnswerState> = {};
        for (const a of data.answers) {
          map[a.question_id] = {
            selectedValue: a.selected_value,
            isCorrect: a.is_correct,
          };
        }
        setAnswers(map);
        if (data.attempt.finished_at) {
          setFinished(true);
          setResult({
            score_points: Number(data.attempt.score_points),
            score_grade: Number(data.attempt.score_grade),
            totalPoints: data.totalPoints,
          });
        }
      } catch {
        setError("Error de red");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attemptId]);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const onAnswer = useCallback(
    async (questionId: string, selectedValue: string) => {
      if (answers[questionId] || finished) return;
      setSubmittingId(questionId);
      setError("");
      try {
        const res = await fetch(`/api/attempts/${attemptId}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, selectedValue }),
        });
        const data = await res.json();
        if (res.status === 409 && data.locked) {
          setAnswers((prev) => ({
            ...prev,
            [questionId]: {
              selectedValue: data.selectedValue,
              isCorrect: data.isCorrect,
            },
          }));
          return;
        }
        if (!res.ok) {
          setError(data.error || "No se guardó la respuesta");
          return;
        }
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            selectedValue: data.selectedValue,
            isCorrect: data.isCorrect,
          },
        }));
      } catch {
        setError("Error al enviar respuesta");
      } finally {
        setSubmittingId(null);
      }
    },
    [answers, attemptId, finished]
  );

  async function finish() {
    if (answeredCount < questions.length) {
      setError("Debes responder todas las preguntas antes de finalizar.");
      return;
    }
    setSubmittingId("__finish__");
    try {
      const res = await fetch(`/api/attempts/${attemptId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo finalizar");
        return;
      }
      setFinished(true);
      setResult({
        score_points: Number(data.attempt.score_points),
        score_grade: Number(data.attempt.score_grade),
        totalPoints: data.totalPoints,
      });
    } catch {
      setError("Error al finalizar");
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">
        Cargando taller…
      </main>
    );
  }

  if (error && !questions.length) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-rose-600">{error}</p>
        <button
          className="mt-4 underline"
          onClick={() => router.push("/")}
          type="button"
        >
          Volver al inicio
        </button>
      </main>
    );
  }

  return (
    <AntiCheat>
      <main className="mx-auto max-w-3xl pb-24 print:hidden">
        <header className="mb-6 rounded-2xl border border-[var(--uv-border)] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[var(--uv-red)]">Estudiante</p>
          <h1 className="text-2xl font-bold text-[var(--uv-ink)]">{fullName}</h1>
          <p className="mt-2 text-sm text-[var(--uv-muted)]">
            Progreso: {answeredCount}/{questions.length} respondidas
            {finished ? " · Finalizado" : ""}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-[var(--uv-red)] transition-all"
              style={{
                width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </header>

        {finished && result ? (
          <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <h2 className="text-xl font-bold text-emerald-900">Taller finalizado</h2>
            <p className="mt-2 text-3xl font-extrabold text-emerald-800">
              Nota: {result.score_grade.toFixed(1)} / 5.0
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Puntos: {result.score_points} / {result.totalPoints}
            </p>
          </section>
        ) : null}

        {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

        <div className="space-y-4">
          {questions.map((q) => {
            const ans = answers[q.id];
            return (
              <DragQuestion
                key={q.id}
                questionId={q.id}
                section={q.section}
                prompt={q.prompt}
                code={q.code}
                options={q.options}
                locked={!!ans || finished}
                selectedValue={ans?.selectedValue}
                isCorrect={ans?.isCorrect ?? null}
                submitting={submittingId === q.id}
                onAnswer={(optionId) => onAnswer(q.id, optionId)}
              />
            );
          })}
        </div>

        {!finished ? (
          <div className="sticky bottom-4 mt-8">
            <button
              type="button"
              onClick={finish}
              disabled={
                answeredCount < questions.length || submittingId === "__finish__"
              }
              className="w-full rounded-2xl bg-[var(--uv-red)] px-4 py-4 font-semibold text-white shadow-lg hover:bg-[var(--uv-red-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {answeredCount < questions.length
                ? `Responde todas (${answeredCount}/${questions.length})`
                : submittingId === "__finish__"
                  ? "Guardando nota…"
                  : "Finalizar y ver nota"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium"
          >
            Volver al inicio
          </button>
        )}
      </main>
    </AntiCheat>
  );
}
