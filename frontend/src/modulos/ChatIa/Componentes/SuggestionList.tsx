interface SuggestionListProps {
  onSelectSuggestion: (sugerencia: string) => void;
  disabled?: boolean;
}

export const SuggestionList = ({
  onSelectSuggestion,
  disabled = false,
}: SuggestionListProps) => {
  const sugerencias = [
    "¿Qué es el VTR y qué significa tener dos VTR 3?",
    "¿Qué significa tener una asignatura con candado y cómo puedo desinscribirla?",
    "¿Qué es la Rebaja Académica Voluntaria (botón de pánico) y cuáles son sus restricciones?",
    "¿Qué es el SIGA y cuándo se ocupa?",
    "¿Cuántos créditos debo tener para pedir rebaja de arancel por baja carga académica?",
    "¿Cuáles son las causas para la eliminación?",
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