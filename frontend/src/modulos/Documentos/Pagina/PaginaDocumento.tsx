
import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import SidebarLayout from "../../Compartido/SidebarLayout";
import { SearchBox } from "../../Compartido/Busqueda";

import {
  FilterSidebar,
  type Filtros,
} from "../Componentes/FilterSidebar";

import { DocumentList } from "../Componentes/DocumentList";

import {
  type Documento,
} from "../Componentes/DocumentosParaVer";

import { useDocuments } from "../../../services/documentService";
import { useSearch, mapFrontendFiltersToAPI, type SearchRequest, type SearchResultItem } from "../../../services/searchService";

// =====================================================
// SCROLL
// =====================================================

function useScrollDirection(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    let previousScrollTop = container.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;

      if (currentScrollTop <= 0) {
        setIsVisible(true);
      } else if (currentScrollTop > previousScrollTop) {
        setIsVisible(false);
      } else if (currentScrollTop < previousScrollTop) {
        setIsVisible(true);
      }

      previousScrollTop = currentScrollTop;
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  return isVisible;
}

// =====================================================
// OBTENER AÑO
// =====================================================

const obtenerAño = (fecha: string) => {
  const coincidencia = fecha.match(/\d{4}/);

  return coincidencia ? coincidencia[0] : "";
};

// =====================================================
// MULTISELECT
// =====================================================

const contieneAlguno = (
  valoresDocumento: string[] | undefined,
  valoresSeleccionados: string[]
) => {
  if (valoresSeleccionados.length === 0) {
    return true;
  }

  if (!valoresDocumento || valoresDocumento.length === 0) {
    return false;
  }

  return valoresSeleccionados.some((valor) =>
    valoresDocumento.includes(valor)
  );
};

// =====================================================
// TRANSFORMAR RESULTADOS DE BÚSQUEDA
// =====================================================

const transformSearchResultToDocumento = (searchResult: SearchResultItem): Documento => {
  const fecha = searchResult.creacion 
    ? new Date(searchResult.creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : 'Sin fecha';

  return {
    id: searchResult.documentid,
    titulo: searchResult.titulo,
    tipo: searchResult.tipodocumento || searchResult.nommetadato || 'Documento',
    estado: searchResult.estadovigencia || 'Vigente',
    fecha: fecha,
    organismo: searchResult.nommetadato || 'Universidad',
    descripcion: searchResult.excerpt || '',
    archivo: `/Pdf/documento_${searchResult.documentid}.pdf`,
    area: searchResult.categorias[0] || undefined,
    sede: searchResult.sedes,
    departamento: [], // Would need to be populated from departamento relation
    carrera: [], // Would need to be populated from carrera relation
  };
};

// =====================================================
// FILTRAR DOCUMENTOS
// =====================================================

const filtrarDocumentos = (
  lista: Documento[],
  filtros: Filtros
) => {
  return lista.filter((doc) => {
    // Tipo
    if (
      filtros.tipoDocumento !== "Todos" &&
      doc.tipo !== filtros.tipoDocumento
    ) {
      return false;
    }

    // Estado
    if (
      filtros.estado !== "Todos" &&
      doc.estado !== filtros.estado
    ) {
      return false;
    }

    // Año
    if (
      filtros.año.length > 0 &&
      !filtros.año.includes(obtenerAño(doc.fecha))
    ) {
      return false;
    }

    // Área
    if (
      filtros.area.length > 0 &&
      !filtros.area.includes(doc.area ?? "")
    ) {
      return false;
    }

    // Sede
    if (!contieneAlguno(doc.sede, filtros.sede)) {
      return false;
    }

    // Departamento
    if (
      !contieneAlguno(
        doc.departamento,
        filtros.departamento
      )
    ) {
      return false;
    }

    // Carrera
    if (
      !contieneAlguno(
        doc.carrera,
        filtros.carrera
      )
    ) {
      return false;
    }

    return true;
  });
};

// =====================================================
// PÁGINA
// =====================================================

export default function PaginaDocumentos() {
  const [searchParams] = useSearchParams();

  const tipoUrl =
    searchParams.get("tipo") || "Todos";

  // ===================================================
  // SEARCH QUERY
  // ===================================================

  const [searchQuery, setSearchQuery] = useState("");

  // ===================================================
  // DOCUMENTOS - REACT QUERY
  // ===================================================

  const { 
    data: documentosFromRegular = [], 
    isLoading: isLoadingDocuments, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useDocuments(0, 50);

  // ===================================================
  // FILTROS
  // ===================================================

  const [filtros, setFiltros] =
    useState<Filtros>({
      tipoDocumento: tipoUrl,
      estado: "Todos",
      area: [],
      sede: [],
      departamento: [],
      carrera: [],
      año: [],
    });

  // ===================================================
  // SEARCH - REACT QUERY
  // ===================================================

  // Determine if we should use search (when filters are applied or query is not empty)
  const hasActiveFilters = 
    filtros.tipoDocumento !== "Todos" ||
    filtros.estado !== "Todos" ||
    filtros.area.length > 0 ||
    filtros.sede.length > 0 ||
    filtros.departamento.length > 0 ||
    filtros.carrera.length > 0 ||
    filtros.año.length > 0 ||
    searchQuery.trim() !== "";

  const searchRequest: SearchRequest = {
    query: searchQuery,
    filters: mapFrontendFiltersToAPI(filtros),
    page: 1,
    page_size: 50,
  };

  const { 
    data: searchResults, 
    isLoading: isLoadingSearch, 
    error: searchError,
    refetch: refetchSearch 
  } = useSearch(searchRequest, hasActiveFilters);

  // Transform search results to Document format
  const documentosFromSearch = useMemo(() => {
    if (!searchResults?.results) return [];
    return searchResults.results.map(transformSearchResultToDocumento);
  }, [searchResults]);

  // Use search results when filters are active, otherwise use regular documents
  const documentosActivos = hasActiveFilters ? documentosFromSearch : documentosFromRegular;
  const isLoading = hasActiveFilters ? isLoadingSearch : isLoadingDocuments;
  const error = hasActiveFilters ? searchError : documentsError;
  const refetch = hasActiveFilters ? refetchSearch : refetchDocuments;

  // ===================================================
  // PANEL GENERAL DE FILTROS - SOLO MÓVIL
  // ===================================================

  const [mostrarFiltros, setMostrarFiltros] =
    useState(false);

  // ===================================================
  // SCROLL DE DOCUMENTOS
  // ===================================================

  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

  const headerVisible =
    useScrollDirection(scrollContainerRef);

  // ===================================================
  // ACTUALIZAR TIPO DESDE URL
  // ===================================================

  useEffect(() => {
    setFiltros((actual) => ({
      ...actual,
      tipoDocumento: tipoUrl,
    }));
  }, [tipoUrl]);

  // ===================================================
  // REFETCH SEARCH WHEN FILTERS CHANGE
  // ===================================================

  useEffect(() => {
    if (hasActiveFilters && refetchSearch) {
      refetchSearch();
    }
  }, [filtros, searchQuery, hasActiveFilters, refetchSearch]);

  // ===================================================
  // LIMPIAR
  // ===================================================

  const limpiarFiltros = () => {
    setFiltros({
      tipoDocumento: "Todos",
      estado: "Todos",
      area: [],
      sede: [],
      departamento: [],
      carrera: [],
      año: [],
    });
  };

  // ===================================================
  // FILTROS APLICADOS (DISABLED FOR NOW)
  // ===================================================

  // const documentosFiltrados =
  //   filtrarDocumentos(
  //     documentos,
  //     filtros
  //   );

  return (
    <SidebarLayout>
      <div
        className="
          flex
          h-dvh
          flex-col
          overflow-hidden
          bg-white
        "
      >
        <main
          className="
            min-h-0
            flex-1
            overflow-hidden
          "
        >
          <div
            className="
              flex
              h-full
              flex-col
              xl:flex-row
            "
          >

            {/* =================================================
                SIDEBAR DE FILTROS - PC
            ================================================= */}

            <aside
              className="
                hidden
                shrink-0
                border-r
                border-slate-200
                xl:block
              "
            >
              <FilterSidebar
                filtros={filtros}
                onFiltrosChange={setFiltros}
                onLimpiarFiltros={limpiarFiltros}
              />
            </aside>

            {/* =================================================
                CONTENIDO PRINCIPAL
            ================================================= */}

            <section
              className="
                flex
                min-h-0
                min-w-0
                flex-1
                flex-col
                overflow-hidden
              "
            >

              {/* =================================================
                  HEADER
              ================================================= */}

              <header
                className={`
                  shrink-0
                  overflow-hidden
                  border-b
                  border-slate-200
                  bg-white
                  px-3
                  py-3
                  transition-[max-height,opacity]
                  duration-300
                  md:p-6
                  md:max-h-none
                  md:opacity-100

                  ${
                    headerVisible
                      ? "max-h-55 opacity-100"
                      : "max-h-0 border-b-0! py-0! opacity-0"
                  }
                `}
              >
                <h1
                  className="
                    mb-3
                    text-xl
                    font-bold
                    text-slate-900
                    md:text-3xl
                  "
                >
                  Buscar documentos
                </h1>

                {/* BUSCADOR */}

                <SearchBox 
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {/* =================================================
                    BOTÓN GENERAL - SOLO MÓVIL
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setMostrarFiltros(
                      !mostrarFiltros
                    )
                  }
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-sidebar
                    bg-sidebar
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-slate-900
                    md:hidden
                  "
                >
                  <span>
                    {mostrarFiltros
                      ? "Ocultar filtros"
                      : "Mostrar filtros"}
                  </span>

                  <span
                    className={`
                      transition-transform
                      ${
                        mostrarFiltros
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  >
                    ▼
                  </span>
                </button>
              </header>

              {/* =================================================
                  FILTROS - TABLET
              ================================================= */}

              <div
                className="
                  hidden
                  min-h-0
                  shrink-0
                  border-b
                  border-slate-200
                  bg-slate-50
                  md:block
                  xl:hidden
                "
              >
                <FilterSidebar
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  onLimpiarFiltros={
                    limpiarFiltros
                  }
                  scrollable={false}
                />
              </div>

              {/* =================================================
                  DOCUMENTOS + PANEL DE FILTROS MÓVIL
              ================================================= */}

              <div
                ref={scrollContainerRef}
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overflow-x-hidden
                  px-3
                  py-3
                  pb-8
                  md:p-6
                "
              >

                {/* PANEL COMPLETO DE FILTROS - SOLO MÓVIL */}

                {mostrarFiltros && (
                  <div
                    className="
                      mb-4
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      shadow-sm
                      md:hidden
                    "
                  >
                    <FilterSidebar
                      filtros={filtros}
                      onFiltrosChange={
                        setFiltros
                      }
                      onLimpiarFiltros={
                        limpiarFiltros
                      }
                      scrollable={false}
                    />
                  </div>
                )}

                {/* LISTA DE DOCUMENTOS */}

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sidebar"></div>
                      <p className="text-sm text-slate-600">Cargando documentos...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-800">
                      {error instanceof Error ? error.message : 'Error al cargar los documentos. Por favor, intenta nuevamente.'}
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <DocumentList
                    documentos={documentosActivos}
                  />
                )}

              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}

