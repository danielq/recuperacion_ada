export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  section: string;
  prompt: string;
  code?: string;
  options: QuestionOption[];
  /** Solo en servidor */
  correctId: string;
  points: number;
};

/**
 * Banco NUEVO de recuperación (distinto al quiz original).
 * 14 preguntas · 23 puntos · nota = 1 + 4*(puntos/23)
 */
export const QUESTIONS: Question[] = [
  {
    id: "A1",
    section: "A — Verdadero / Falso",
    prompt:
      "Si f(n) = O(g(n)) y f(n) = Ω(g(n)), entonces necesariamente f(n) = Θ(g(n)).",
    options: [
      { id: "V", label: "Verdadero" },
      { id: "F", label: "Falso" },
    ],
    correctId: "V",
    points: 1,
  },
  {
    id: "A2",
    section: "A — Verdadero / Falso",
    prompt:
      "Una cota O(n²) para un algoritmo lineal Θ(n) es válida, pero poco útil porque el techo está exagerado.",
    options: [
      { id: "V", label: "Verdadero" },
      { id: "F", label: "Falso" },
    ],
    correctId: "V",
    points: 1,
  },
  {
    id: "A3",
    section: "A — Verdadero / Falso",
    prompt:
      "Si lim f(n)/g(n) = ∞, entonces f = Θ(g).",
    options: [
      { id: "V", label: "Verdadero" },
      { id: "F", label: "Falso" },
    ],
    correctId: "F",
    points: 1,
  },
  {
    id: "A4",
    section: "A — Verdadero / Falso",
    prompt:
      "Quick Sort tiene peor caso O(n²) y mejor caso Ω(n log n); por eso no admite una Θ global única para todos los datos.",
    options: [
      { id: "V", label: "Verdadero" },
      { id: "F", label: "Falso" },
    ],
    correctId: "V",
    points: 1,
  },
  {
    id: "A5",
    section: "A — Verdadero / Falso",
    prompt:
      "Big Ω siempre describe el caso promedio de un algoritmo.",
    options: [
      { id: "V", label: "Verdadero" },
      { id: "F", label: "Falso" },
    ],
    correctId: "F",
    points: 1,
  },
  {
    id: "B1",
    section: "B — Límites",
    prompt: "f(n) = 6n + 12 , g(n) = n. ¿Qué aplica según L = lim f/g?",
    options: [
      { id: "solo_O", label: "solo O" },
      { id: "solo_Omega", label: "solo Ω" },
      { id: "O_Omega_Theta", label: "O, Ω y Θ" },
      { id: "ninguna", label: "ninguna" },
    ],
    correctId: "O_Omega_Theta",
    points: 2,
  },
  {
    id: "B2",
    section: "B — Límites",
    prompt: "f(n) = 4n³ + n , g(n) = n². ¿Qué aplica?",
    options: [
      { id: "solo_O", label: "solo O" },
      { id: "solo_Omega", label: "solo Ω" },
      { id: "O_Omega_Theta", label: "O, Ω y Θ" },
      { id: "ninguna", label: "ninguna" },
    ],
    correctId: "solo_Omega",
    points: 2,
  },
  {
    id: "B3",
    section: "B — Límites",
    prompt: "f(n) = n log n + 8n , g(n) = n². ¿Qué aplica?",
    options: [
      { id: "solo_O", label: "solo O" },
      { id: "solo_Omega", label: "solo Ω" },
      { id: "O_Omega_Theta", label: "O, Ω y Θ" },
      { id: "ninguna", label: "ninguna" },
    ],
    correctId: "solo_O",
    points: 2,
  },
  {
    id: "B4",
    section: "B — Límites",
    prompt: "f(n) = 3n² + 2n + 1 , g(n) = n². ¿Qué aplica?",
    options: [
      { id: "solo_O", label: "solo O" },
      { id: "solo_Omega", label: "solo Ω" },
      { id: "O_Omega_Theta", label: "O, Ω y Θ" },
      { id: "ninguna", label: "ninguna" },
    ],
    correctId: "O_Omega_Theta",
    points: 2,
  },
  {
    id: "C1",
    section: "C — Código",
    prompt: "Respecto a n = len(datos), ¿cuál es la mejor afirmación?",
    code: `def maximo(datos):
    m = datos[0]
    for x in datos:
        if x > m:
            m = x
    return m`,
    options: [
      { id: "theta_n", label: "Θ(n) global (siempre recorre todo)" },
      { id: "no_theta", label: "Sin Θ global (puede cortar temprano)" },
      { id: "theta_1", label: "Θ(1) siempre" },
      { id: "theta_n2", label: "Θ(n²)" },
    ],
    correctId: "theta_n",
    points: 2,
  },
  {
    id: "C2",
    section: "C — Código",
    prompt: "¿Hay Θ global?",
    code: `def contiene_cero(lista):
    for x in lista:
        if x == 0:
            return True
    return False`,
    options: [
      { id: "theta_n", label: "Sí → Θ(n)" },
      { id: "no_theta", label: "No: Ω(1) mejor / O(n) peor" },
      { id: "theta_n2", label: "Sí → Θ(n²)" },
      { id: "theta_log", label: "Sí → Θ(log n)" },
    ],
    correctId: "no_theta",
    points: 2,
  },
  {
    id: "C3",
    section: "C — Código",
    prompt: "¿Orden exacto del número de impresiones?",
    code: `def triangulo(n):
    for i in range(n):
        for j in range(i + 1):
            print(i, j)`,
    options: [
      { id: "theta_n", label: "Θ(n)" },
      { id: "theta_n2", label: "Θ(n²)" },
      { id: "theta_nlog", label: "Θ(n log n)" },
      { id: "no_theta", label: "Sin Θ (depende de la suerte)" },
    ],
    correctId: "theta_n2",
    points: 2,
  },
  {
    id: "D1",
    section: "D — Aplicación",
    prompt:
      "Un microservicio cifra siempre un archivo completo de n bytes (sin atajos). ¿Qué notación conviene para estimar costo cloud?",
    options: [
      { id: "theta_n", label: "Θ(n) — costo predecible" },
      { id: "solo_omega_1", label: "solo Ω(1)" },
      { id: "o_n3_flojo", label: "O(n³) como cota preferida" },
      { id: "sin_theta", label: "Imposible usar Θ" },
    ],
    correctId: "theta_n",
    points: 2,
  },
  {
    id: "D2",
    section: "D — Aplicación",
    prompt:
      "Para un cierre nocturno que DEBE recorrer el 100% de cuentas, ¿por qué preferir un algoritmo con Θ estable frente a uno solo con O “suelta”?",
    options: [
      {
        id: "latencia_predecible",
        label: "Porque piso≈techo ⇒ latencia/costo más predecibles",
      },
      { id: "o_siempre_mejor", label: "Porque Big O siempre es más exacta que Θ" },
      { id: "omega_igual_promedio", label: "Porque Ω es el caso promedio" },
      { id: "no_importa", label: "No importa; todas las cotas son iguales" },
    ],
    correctId: "latencia_predecible",
    points: 2,
  },
];

export const TOTAL_POINTS = QUESTIONS.reduce((s, q) => s + q.points, 0);

export function publicQuestions() {
  return QUESTIONS.map((q) => {
    const { correctId, ...rest } = q;
    void correctId;
    return rest;
  });
}

export function getQuestion(id: string) {
  return QUESTIONS.find((q) => q.id === id);
}

/** Nota escala 1.0 – 5.0 */
export function toGrade(points: number) {
  const grade = 1 + (points / TOTAL_POINTS) * 4;
  return Math.round(grade * 10) / 10;
}
