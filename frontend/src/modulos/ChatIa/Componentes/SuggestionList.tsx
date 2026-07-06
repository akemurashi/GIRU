export const SuggestionList = () => {
  const sugerencias = [
    "¿Cuál es el porcentaje mínimo de asistencia?",
    "¿Cómo se calculan los promedios ponderados?",
    "¿Qué es la causal de eliminación académica?",
    "¿Cuándo puedo solicitar anulación de asignatura?",
    "¿Qué documentos necesito para convalidación?",
  ];

  return (
    <section className="space-y-2">
      {sugerencias.map((sugerencia) => (
        <button
          key={sugerencia}
          className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:border-sky-900 hover:bg-sky-50"
        >
          <i className="pi pi-question-circle text-sky-900"></i>

          <span className="flex-1 leading-5 text-gray-700 group-hover:text-gray-900">
            {sugerencia}
          </span>

          <i className="pi pi-angle-right text-gray-400 group-hover:text-sky-900"></i>
        </button>
      ))}
    </section>
  );
};