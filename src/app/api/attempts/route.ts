import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { TOTAL_POINTS, QUESTIONS } from "@/lib/questions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName ?? "").trim();

    if (fullName.length < 5 || !fullName.includes(" ")) {
      return NextResponse.json(
        {
          error:
            "Escribe nombres y apellidos completos (mínimo nombre y apellido).",
        },
        { status: 400 }
      );
    }

    const sql = getSql();
    const rows = await sql`
      INSERT INTO attempts (full_name, total_questions)
      VALUES (${fullName}, ${QUESTIONS.length})
      RETURNING id, full_name, started_at
    `;

    return NextResponse.json({
      attemptId: rows[0].id,
      fullName: rows[0].full_name,
      totalQuestions: QUESTIONS.length,
      totalPoints: TOTAL_POINTS,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No se pudo iniciar el taller" }, { status: 500 });
  }
}
