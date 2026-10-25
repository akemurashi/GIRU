interface SuggestionListProps {
  onSelectSuggestion: (sugerencia: string) => void;
  disabled?: boolean;
}

export const SuggestionList = ({
  onSelectSuggestion,
  disabled = false,
}: SuggestionListProps) => {
  const sugerencias = [
    "¿Cuántos créditos SCT puedo inscribir por semestre y cómo solicito más de 35 créditos?",
    "¿Qué significa tener una asignatura con candado y cómo puedo desinscribirla?",
    "¿Qué es la Rebaja Académica Voluntaria (botón de pánico) y cuáles son sus restricciones?",
    "¿Cómo puedo convalidar asignaturas o ramos cursados en una carrera anterior?",
    "¿Cuántos créditos debo tener para pedir rebaja de arancel por baja carga académica?",
    "¿Qué debo hacer para solicitar un retiro temporal, reincorporación o matrícula sin ramos?",
  ];

  return (
    <section className="space-y-2">
      {sugerencias.map((sugerencia) => (
        <button
          key={sugerencia}
          type="button"
          disabled={disabled}
          onClick={() => onSelectSuggestion(sugerencia)}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:border-sky-900 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
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