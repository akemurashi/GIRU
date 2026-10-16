import { useState, useEffect, useRef, type KeyboardEvent } from "react";

import { useAutocomplete, type LexicalSuggestionItem } from "../../services/searchService";

import { useDebouncedValue } from "../../Hooks/useDebouncedValue";

// Referencia estable: evita que un `[]` nuevo en cada render dispare efectos.
const SIN_SUGERENCIAS: LexicalSuggestionItem[] = [];

// Pausa (ms) tras la última tecla antes de consultar el autocompletado.
const AUTOCOMPLETE_DEBOUNCE_MS = 300;

export type SearchBoxProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSelectSuggestion?: (item: LexicalSuggestionItem) => void;
  onSubmitSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchBox = ({
  value: controlledValue,
  onChange,
  onSelectSuggestion,
  onSubmitSearch,
  placeholder = "Busca por tema, artículo, o usa '#' para búsqueda léxica directa",
  className = "",
}: SearchBoxProps = {}) => {
  const [internalValue, setInternalValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Soporta modo controlado y no controlado
  const busqueda = controlledValue !== undefined ? controlledValue : internalValue;
  const setBusqueda = onChange || setInternalValue;

  // Debounce para optimizar las peticiones de autocompletado en PostgreSQL
  const debouncedQuery = useDebouncedValue(busqueda, AUTOCOMPLETE_DEBOUNCE_MS);

  const containerRef = useRef<HTMLDivElement>(null);

  // Solo se activa cuando la consulta inicia con '#'
  const isLexical = busqueda.trim().startsWith("#");
  const lexicalTerm = busqueda.trim().replace(/^#+/, "").trim();
  const hasEnoughChars = lexicalTerm.length >= 2;

  // El usuario sigue escribiendo: el valor debounced aún no alcanzó al input.
  const isDebouncing = busqueda.trim() !== debouncedQuery.trim();

  // Consulta al backend solo si es búsqueda léxica, tiene al menos 2 caracteres
  // y el desplegable está abierto.
  const { data, isFetching, isError } = useAutocomplete(
    debouncedQuery,
    8,
    isOpen
  );

  // Estado de "buscando" coherente con lo que se ve en el input:
  // cubre tanto la espera del debounce como la petición en curso.
  const isSearching = isLexical && hasEnoughChars && (isDebouncing || isFetching);

  // Mientras el debounce no se asienta, `data` pertenece a un texto anterior:
  // no se muestra para no ofrecer sugerencias que no corresponden.
  const sugerencias =
    isLexical && !isDebouncing && data?.suggestions
      ? data.suggestions
      : SIN_SUGERENCIAS;

  // Cerrar el dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reiniciar índice resaltado al cambiar las sugerencias
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [sugerencias]);

  const handleSelectSuggestion = (sugerencia: LexicalSuggestionItem) => {
    // Autocompleta en el input con '#' y el texto sugerido
    const completedText = `#${sugerencia.suggestion}`;
    setBusqueda(completedText);
    setIsOpen(false);
    onSelectSuggestion?.(sugerencia);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown" && isOpen && sugerencias.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < sugerencias.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp" && isOpen && sugerencias.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : sugerencias.length - 1
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (
        isOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < sugerencias.length
      ) {
        handleSelectSuggestion(sugerencias[highlightedIndex]);
        return;
      }

      const query = busqueda.trim();
      if (query) {
        setIsOpen(false);
        // Enviamos la query con '#' intacto para que PaginaDocumentos reconozca que es léxica
        onSubmitSearch?.(query);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? "z-50" : "z-10"} ${className}`}>
      {/* Icono de búsqueda o hashtag */}
      <i
        className={`absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-sm md:text-base transition-colors ${
          isLexical ? "pi pi-hashtag text-blue-600 font-bold" : "pi pi-search text-slate-400"
        }`}
      />

      <input
        type="text"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (isLexical) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 md:pl-12 pr-10 py-2.5 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />

      {/* Botón de limpiar o indicador de carga */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {isSearching ? (
          <i className="pi pi-spin pi-spinner text-blue-500 text-sm md:text-base" />
        ) : busqueda.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setIsOpen(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            title="Limpiar búsqueda"
          >
            <i className="pi pi-times text-xs" />
          </button>
        ) : null}
      </div>

      {/* Panel de sugerencias exclusivo para búsqueda léxica (#) */}
      {isLexical && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header del dropdown */}
          <div className="px-4 py-2.5 bg-slate-50 text-[11px] font-semibold text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="pi pi-hashtag text-blue-600 text-xs" />
              Sugerencias léxicas
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Usa ↑ ↓ y Enter
            </span>
          </div>

          {/* Estado 1: Escribió solo '#' o 1 caracter */}
          {!hasEnoughChars && (
            <div className="px-4 py-3 text-xs md:text-sm text-slate-500 flex items-center gap-2.5">
              <i className="pi pi-info-circle text-blue-500 text-sm shrink-0" />
              <span>
                Escribe al menos <strong>2 caracteres</strong> después de <code className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-mono text-xs">#</code> para sugerir títulos o metadatos.
              </span>
            </div>
          )}

          {/* Estado 2: Cargando */}
          {isSearching && sugerencias.length === 0 && (
            <div className="px-4 py-4 text-xs md:text-sm text-slate-500 flex items-center justify-center gap-2">
              <i className="pi pi-spin pi-spinner text-blue-500" />
              <span>Buscando coincidencias...</span>
            </div>
          )}

          {/* Estado 3a: Error de red / backend */}
          {!isSearching && hasEnoughChars && isError && (
            <div className="px-4 py-4 text-xs md:text-sm text-red-600 text-center">
              No se pudieron cargar las sugerencias. Inténtalo de nuevo.
            </div>
          )}

          {/* Estado 3b: Sin resultados */}
          {!isSearching && hasEnoughChars && !isError && sugerencias.length === 0 && (
            <div className="px-4 py-4 text-xs md:text-sm text-slate-500 text-center">
              No se encontraron títulos ni metadatos que coincidan con "<strong>{lexicalTerm}</strong>"
            </div>
          )}

          {/* Estado 4: Lista de sugerencias */}
          {sugerencias.length > 0 && (
            <div className="max-h-72 overflow-y-auto py-1">
              {sugerencias.map((item, index) => {
                const isSelected = highlightedIndex === index;
                const isTitleMatch = item.matched_field === "titulo";

                return (
                  <button
                    key={`${item.documentid}-${index}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 ${
                      isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <i
                      className={`pi ${
                        isTitleMatch ? "pi-file" : "pi-tag"
                      } mt-1 text-xs shrink-0 ${
                        isSelected ? "text-blue-600" : "text-slate-400"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs md:text-sm font-medium text-slate-900 truncate">
                          {item.titulo}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${
                            isTitleMatch
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isTitleMatch ? "Título" : "Metadato"}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                        {item.numero && (
                          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1 py-0.2 rounded">
                            {item.numero}
                          </span>
                        )}
                        <span className="truncate">
                          Metadato: {item.nommetadato}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;