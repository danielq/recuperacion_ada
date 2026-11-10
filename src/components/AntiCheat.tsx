"use client";

import { useEffect } from "react";

/**
 * Protecciones razonables anti copia/pega hacia buscadores/IA.
 * No es a prueba de capturas de pantalla ni DevTools avanzado.
 */
export default function AntiCheat({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const combo =
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "a", "s", "p", "u"].includes(key);
      if (combo) {
        e.preventDefault();
        e.stopPropagation();
      }
      // F12 / Ctrl+Shift+I / Ctrl+Shift+C / Ctrl+Shift+J
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ["i", "c", "j"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const blockContext = (e: Event) => {
      e.preventDefault();
    };

    const blockCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const blockDrag = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("[data-anti-cheat]")) {
        // permitir drag de chips de respuesta (@dnd-kit), bloquear texto
        if (t.closest("[data-allow-dnd]")) return;
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys, true);
    document.addEventListener("contextmenu", blockContext, true);
    document.addEventListener("copy", blockCopy, true);
    document.addEventListener("cut", blockCopy, true);
    document.addEventListener("dragstart", blockDrag, true);

    return () => {
      document.removeEventListener("keydown", blockKeys, true);
      document.removeEventListener("contextmenu", blockContext, true);
      document.removeEventListener("copy", blockCopy, true);
      document.removeEventListener("cut", blockCopy, true);
      document.removeEventListener("dragstart", blockDrag, true);
    };
  }, []);

  return (
    <div
      data-anti-cheat
      className="select-none [&_*]:select-none"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <p className="mt-4 text-center text-[11px] text-[var(--uv-muted)]">
        Contenido protegido para evaluación · no copiar/pegar a buscadores o IA
      </p>
    </div>
  );
}
