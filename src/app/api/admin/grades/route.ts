import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT
        a.id,
        a.full_name,
        a.started_at,
        a.finished_at,
        a.score_points,
        a.score_grade,
        a.total_questions,
        (
          SELECT COUNT(*)::int FROM answers ans
          WHERE ans.attempt_id = a.id AND ans.is_correct
        ) AS correct_count,
        (
          SELECT COUNT(*)::int FROM answers ans
          WHERE ans.attempt_id = a.id
        ) AS answered_count
      FROM attempts a
      ORDER BY a.started_at DESC
    `;

    return NextResponse.json({ grades: rows, admin: session.username });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al listar notas" }, { status: 500 });
  }
}
