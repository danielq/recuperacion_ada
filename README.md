# Taller de Recuperación — Big O / Ω / Θ

App web (Next.js) + Neon PostgreSQL para el taller de recuperación ADA.

## Credenciales admin (solo docente)

- **Usuario:** `daniel.quintero`
- **Contraseña:** (la que te dio el asistente al configurar; está en tu chat / notas personales)

## Base de datos

- Neon DB: `recuperacion_ada`
- Variables en `.env.local` (no subir a Git)

## Desarrollo local

```bash
cd taller-recuperacion
npm install
npm run dev
```

Abre http://localhost:3000

- Estudiantes: inicio → nombre completo → taller drag & drop
- Admin: http://localhost:3000/admin/login

## Deploy gratis (estudiantes en internet)

1. Sube el proyecto a GitHub **sin** `.env.local`
2. Importa en [Vercel](https://vercel.com)
3. En Environment Variables pega:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `ADMIN_USERNAME=daniel.quintero`
4. Deploy → comparte la URL con el curso

## Docker (Postgres local opcional)

```bash
docker compose up -d
# Luego apunta DATABASE_URL a postgresql://ada:ada123@localhost:5433/recuperacion_ada
```

## Nota

Escala 1.0–5.0: `nota = 1 + 4 * (puntos / 23)`
