
import { useNavigate } from "react-router-dom";
import { SearchBox } from "../../Compartido/Busqueda";
import type { LexicalSuggestionItem } from "../../../services/searchService";

export const SectionTituloYbusqueda = () => {
  const navigate = useNavigate();

  const handleSubmitSearch = (query: string) => {
    const busqueda = query.trim();

    if (!busqueda) return;

    navigate(`/documentos?query=${encodeURIComponent(busqueda)}`);
  };

  const handleSelectSuggestion = (item: LexicalSuggestionItem) => {
    const query = `#${item.suggestion}`;

    navigate(
      `/documentos?query=${encodeURIComponent(query)}&docId=${encodeURIComponent(
        String(item.documentid)
      )}`
    );
  };

  return (
    <section className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-5xl px-8 py-8 md:py-16">
        <h1 className="mb-3 text-2xl font-bold text-slate-900 md:mb-4 md:text-4xl">
          Gestión Inteligente de Reglamentos Universitarios
        </h1>

        <p className="mb-6 max-w-3xl text-base text-slate-600 md:mb-8 md:text-xl">
          Encuentra la normativa aplicable, verifica su vigencia y comprende su
          significado de manera rápida y precisa.
        </p>

        <SearchBox
          onSubmitSearch={handleSubmitSearch}
          onSelectSuggestion={handleSelectSuggestion}
        />
      </div>
    </section>
  );
};
