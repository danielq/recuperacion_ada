import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getQuestion } from "@/lib/questions";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const questionId = String(body.questionId ?? "");
    const selectedValue = String(body.selectedValue ?? "");

    const question = getQuestion(questionId);
    if (!question) {
      return NextResponse.json({ error: "Pregunta inválida" }, { status: 400 });
    }

    const validOption = question.options.some((o) => o.id === selectedValue);
    if (!validOption) {
      return NextResponse.json({ error: "Opción inválida" }, { status: 400 });
    }

    const sql = getSql();

    const attempts = await sql`
      SELECT id, finished_at FROM attempts WHERE id = ${id}::uuid
    `;
    if (!attempts.length) {
      return NextResponse.json({ error: "Intento no encontrado" }, { status: 404 });
    }
    if (attempts[0].finished_at) {
      return NextResponse.json(
        { error: "El taller ya fue finalizado; no se pueden cambiar respuestas" },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT question_id, selected_value, is_correct
      FROM answers
      WHERE attempt_id = ${id}::uuid AND question_id = ${questionId}
    `;
    if (existing.length) {
      return NextResponse.json(
        {
          error: "Esta pregunta ya fue respondida y está bloqueada",
          locked: true,
          isCorrect: existing[0].is_correct,
          selectedValue: existing[0].selected_value,
        },
        { status: 409 }
      );
    }

    const isCorrect = selectedValue === question.correctId;

    await sql`
      INSERT INTO answers (attempt_id, question_id, selected_value, is_correct)
      VALUES (${id}::uuid, ${questionId}, ${selectedValue}, ${isCorrect})
    `;

    return NextResponse.json({
      questionId,
      selectedValue,
      isCorrect,
      locked: true,
      pointsIfCorrect: question.points,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo guardar la respuesta" }, { status: 500 });
  }
}
