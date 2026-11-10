import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSql } from "@/lib/db";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = String(username ?? "").trim();
    const pass = String(password ?? "");

    if (!user || !pass) {
      return NextResponse.json({ error: "Usuario y clave requeridos" }, { status: 400 });
    }

    const sql = getSql();
    const rows = await sql`
      SELECT username, password_hash FROM admins WHERE username = ${user}
    `;

    if (!rows.length) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const ok = await bcrypt.compare(pass, rows[0].password_hash as string);
    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    await createAdminSession(rows[0].username as string);
    return NextResponse.json({ ok: true, username: rows[0].username });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error de login" }, { status: 500 });
  }
}
