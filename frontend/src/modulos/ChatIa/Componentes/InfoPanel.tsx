import { SuggestionList } from "./SuggestionList";
import { FeaturedDocuments } from "./FeaturedDocuments";

export const InfoPanel = () => {
  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-50 xl:block">
      <div className="space-y-8 px-6 py-6">
        <section>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <i className="pi pi-lightbulb text-sky-900"></i>
            Sugerencias de consulta
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Preguntas frecuentes para consultar reglamentos y normativas.
          </p>
        </section>

        <SuggestionList />

        <FeaturedDocuments />
      </div>
    </aside>
  );
};