import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import {
  publicQuestions,
  TOTAL_POINTS,
  toGrade,
  QUESTIONS,
} from "@/lib/questions";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();

    const attempts = await sql`
      SELECT id, full_name, started_at, finished_at, score_points, score_grade, total_questions
      FROM attempts WHERE id = ${id}::uuid
    `;
    if (!attempts.length) {
      return NextResponse.json({ error: "Intento no encontrado" }, { status: 404 });
    }

    const answers = await sql`
      SELECT question_id, selected_value, is_correct, answered_at
      FROM answers WHERE attempt_id = ${id}::uuid
    `;

    return NextResponse.json({
      attempt: attempts[0],
      answers,
      questions: publicQuestions(),
      totalPoints: TOTAL_POINTS,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al cargar el taller" }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    if (body.action !== "finish") {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    const sql = getSql();
    const attempts = await sql`
      SELECT id, finished_at FROM attempts WHERE id = ${id}::uuid
    `;
    if (!attempts.length) {
      return NextResponse.json({ error: "Intento no encontrado" }, { status: 404 });
    }
    if (attempts[0].finished_at) {
      return NextResponse.json({ error: "El taller ya fue finalizado" }, { status: 400 });
    }

    const answerRows = await sql`
      SELECT question_id, is_correct
      FROM answers WHERE attempt_id = ${id}::uuid
    `;

    const pointsMap = Object.fromEntries(
      QUESTIONS.map((q) => [q.id, q.points])
    );
    let points = 0;
    for (const row of answerRows) {
      if (row.is_correct) {
        points += pointsMap[row.question_id as string] ?? 0;
      }
    }
    const grade = toGrade(points);

    const updated = await sql`
      UPDATE attempts
      SET finished_at = NOW(), score_points = ${points}, score_grade = ${grade}
      WHERE id = ${id}::uuid
      RETURNING id, full_name, score_points, score_grade, finished_at, total_questions
    `;

    const answers = await sql`
      SELECT question_id, selected_value, is_correct
      FROM answers WHERE attempt_id = ${id}::uuid
      ORDER BY question_id
    `;

    return NextResponse.json({
      attempt: updated[0],
      answers,
      totalPoints: TOTAL_POINTS,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo finalizar" }, { status: 500 });
  }
}
