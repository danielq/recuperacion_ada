"use client";

import { useDraggable, useDroppable, DndContext, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Option = { id: string; label: string };

type Props = {
  questionId: string;
  section: string;
  prompt: string;
  code?: string;
  options: Option[];
  locked: boolean;
  selectedValue?: string;
  isCorrect?: boolean | null;
  submitting?: boolean;
  onAnswer: (optionId: string) => void;
};

function Chip({
  id,
  label,
  disabled,
}: {
  id: string;
  label: string;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      data-allow-dnd
      disabled={disabled}
      className={`rounded-lg border px-3 py-2 text-left text-sm font-medium shadow-sm transition
        ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "cursor-grab border-[var(--uv-red)]/30 bg-white text-[var(--uv-ink)] active:cursor-grabbing hover:border-[var(--uv-red)] hover:bg-red-50"
        }`}
    >
      {label}
    </button>
  );
}

function DropZone({
  questionId,
  locked,
  selectedLabel,
  isCorrect,
}: {
  questionId: string;
  locked: boolean;
  selectedLabel?: string;
  isCorrect?: boolean | null;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${questionId}`,
    disabled: locked,
  });

  let zoneClass =
    "min-h-[64px] rounded-xl border-2 border-dashed px-4 py-3 transition ";
  if (locked && isCorrect === true) {
    zoneClass += "border-emerald-500 bg-emerald-50 text-emerald-900";
  } else if (locked && isCorrect === false) {
    zoneClass += "border-rose-500 bg-rose-50 text-rose-900";
  } else if (isOver) {
    zoneClass += "border-[var(--uv-red)] bg-red-50";
  } else {
    zoneClass += "border-[var(--uv-border)] bg-slate-50 text-[var(--uv-muted)]";
  }

  return (
    <div ref={setNodeRef} className={zoneClass}>
      {locked && selectedLabel ? (
        <div>
          <p className="font-semibold">{selectedLabel}</p>
          <p className="mt-1 text-sm">
            {isCorrect ? "✅ Correcto — respuesta bloqueada" : "❌ Incorrecto — respuesta bloqueada"}
          </p>
        </div>
      ) : (
        <p className="text-sm">Arrastra aquí tu respuesta</p>
      )}
    </div>
  );
}

export default function DragQuestion({
  questionId,
  section,
  prompt,
  code,
  options,
  locked,
  selectedValue,
  isCorrect,
  submitting,
  onAnswer,
}: Props) {
  const selectedLabel = options.find((o) => o.id === selectedValue)?.label;

  function handleDragEnd(event: DragEndEvent) {
    if (locked || submitting) return;
    const { over, active } = event;
    if (!over) return;
    if (over.id !== `drop-${questionId}`) return;
    onAnswer(String(active.id));
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <article className="rounded-2xl border border-[var(--uv-border)] border-l-4 border-l-[var(--uv-red)] bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--uv-red)]">
          {questionId} · {section}
        </p>
        <p className="mt-2 text-base font-medium text-[var(--uv-ink)]">{prompt}</p>
        {code ? (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--uv-ink)] p-3 text-sm text-red-100">
            {code}
          </pre>
        ) : null}

        <div className="mt-4">
          <DropZone
            questionId={questionId}
            locked={locked}
            selectedLabel={selectedLabel}
            isCorrect={isCorrect}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((o) => (
            <Chip
              key={o.id}
              id={o.id}
              label={o.label}
              disabled={locked || !!submitting}
            />
          ))}
        </div>

        {/* Fallback click for mobile / accessibility */}
        {!locked ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            <span className="w-full text-xs text-slate-500">
              En móvil también puedes tocar una opción:
            </span>
            {options.map((o) => (
              <button
                key={`tap-${o.id}`}
                type="button"
                disabled={!!submitting}
                onClick={() => onAnswer(o.id)}
                className="rounded-md bg-[var(--uv-ink)] px-2.5 py-1.5 text-xs text-white hover:bg-[var(--uv-red)] disabled:opacity-50"
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : null}
      </article>
    </DndContext>
  );
}
