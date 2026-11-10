import Link from "next/link";

export default function UnivalleChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--uv-bg)]">
      {/* Franja gov.co estilo portal */}
      <div className="bg-[var(--uv-ink)] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1.5 text-[11px]">
          <a
            href="https://www.gov.co"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 opacity-90 hover:opacity-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/gov-co.png" alt="gov.co" className="h-5 w-auto" />
          </a>
          <a
            href="https://www.univalle.edu.co"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            www.univalle.edu.co
          </a>
        </div>
      </div>

      {/* Header institucional */}
      <header className="border-b-4 border-[var(--uv-red)] bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/uv-mark.svg"
              alt="Universidad del Valle"
              className="h-12 w-12"
            />
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-univalle.jpg"
                alt="Universidad del Valle"
                className="h-8 w-auto max-w-[220px] object-contain sm:h-9"
              />
              <p className="mt-0.5 text-xs font-medium text-[var(--uv-muted)]">
                Facultad de Ingeniería · ADA
              </p>
            </div>
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--uv-red)]">
              Taller de recuperación
            </p>
            <p className="text-sm font-bold text-[var(--uv-ink)]">
              Big O · Ω · Θ
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>

      <footer className="mt-auto border-t border-slate-200 bg-[var(--uv-ink)] text-white">
        <div className="mx-auto max-w-5xl px-4 py-5 text-center text-xs leading-relaxed text-white/80">
          <p className="font-semibold text-white">Universidad del Valle</p>
          <p>
            Ciudad Universitaria Meléndez · Cali, Colombia ·{" "}
            <a
              href="https://www.univalle.edu.co"
              className="underline hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              univalle.edu.co
            </a>
          </p>
          <p className="mt-1 text-white/60">
            Uso institucional del logosímbolo para actividad académica ADA.
          </p>
        </div>
      </footer>
    </div>
  );
}
