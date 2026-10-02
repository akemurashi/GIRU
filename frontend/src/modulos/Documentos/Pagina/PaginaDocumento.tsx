import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

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

import {
  useSearch,
  mapFrontendFiltersToAPI,
  type SearchRequest,
  type SearchResultItem,
} from "../../../services/searchService";

// =====================================================
// SCROLL
// =====================================================

function useScrollDirection(
  scrollContainerRef: React.RefObject<
    HTMLDivElement | null
  >
) {
  const [isVisible, setIsVisible] =
    useState(true);

  useEffect(() => {
    const container =
      scrollContainerRef.current;

    if (!container) return;

    let previousScrollTop =
      container.scrollTop;

    const handleScroll = () => {
      const currentScrollTop =
        container.scrollTop;

      if (currentScrollTop <= 0) {
        setIsVisible(true);
      } else if (
        currentScrollTop >
        previousScrollTop
      ) {
        setIsVisible(false);
      } else if (
        currentScrollTop <
        previousScrollTop
      ) {
        setIsVisible(true);
      }

      previousScrollTop =
        currentScrollTop;
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [scrollContainerRef]);

  return isVisible;
}

// =====================================================
// OBTENER AÑO
// =====================================================

const obtenerAño = (fecha: string) => {
  const coincidencia =
    fecha.match(/\d{4}/);

  return coincidencia
    ? coincidencia[0]
    : "";
};

// =====================================================
// MULTISELECT
// =====================================================

const contieneAlguno = (
  valoresDocumento:
    | string[]
    | undefined,
  valoresSeleccionados: string[]
) => {
  if (
    valoresSeleccionados.length ===
    0
  ) {
    return true;
  }

  if (
    !valoresDocumento ||
    valoresDocumento.length === 0
  ) {
    return false;
  }

  return valoresSeleccionados.some(
    (valor: string) =>
      valoresDocumento.includes(valor)
  );
};

// =====================================================
// TRANSFORMAR RESULTADOS
// =====================================================

const transformSearchResultToDocumento = (
  searchResult: SearchResultItem
): Documento => {
  const fecha = searchResult.creacion
    ? new Date(
        searchResult.creacion
      ).toLocaleDateString(
        "es-ES",
        {
          year: "numeric",
          month: "long",
        }
      )
    : "Sin fecha";

  return {
    id: searchResult.documentid,

    titulo: searchResult.titulo,

    tipo:
      searchResult.tipodocumento ||
      searchResult.nommetadato ||
      "Documento",

    estado:
      searchResult.estadovigencia ||
      "Vigente",

    fecha,

    organismo:
      searchResult.nommetadato ||
      "Universidad",

    descripcion:
      searchResult.excerpt || "",

    archivo: `/Pdf/documento_${searchResult.documentid}.pdf`,

    area:
      searchResult.categorias[0] ||
      undefined,

    sede:
      searchResult.sedes,

    departamento: [],

    carrera: [],
  };
};

// =====================================================
// FILTRAR DOCUMENTOS
// =====================================================

const filtrarDocumentos = (
  lista: Documento[],
  filtros: Filtros
) => {
  return lista.filter(
    (doc: Documento) => {

      // Tipo
      if (
        filtros.tipoDocumento !==
          "Todos" &&
        doc.tipo !==
          filtros.tipoDocumento
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
        !filtros.año.includes(
          obtenerAño(doc.fecha)
        )
      ) {
        return false;
      }

      // Área
      if (
        filtros.area.length > 0 &&
        !filtros.area.includes(
          doc.area ?? ""
        )
      ) {
        return false;
      }

      // Sede
      if (
        !contieneAlguno(
          doc.sede,
          filtros.sede
        )
      ) {
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
    }
  );
};

// =====================================================
// PÁGINA
// =====================================================

export default function PaginaDocumentos() {
  const [searchParams] =
    useSearchParams();

  const tipoUrl =
    searchParams.get("tipo") ||
    "Todos";

  // ===================================================
  // SEARCH QUERY
  // ===================================================

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  // ===================================================
  // DOCUMENTOS - REACT QUERY
  // ===================================================

  const {
    data: documentosFromRegular = [],
    isLoading:
      isLoadingDocuments,
    error: documentsError,
    refetch:
      refetchDocuments,
  } = useDocuments(0, 50);

  // ===================================================
  // FILTROS APLICADOS
  // ===================================================

  const [
    filtros,
    setFiltros,
  ] = useState<Filtros>({
    tipoDocumento: tipoUrl,
    estado: "Todos",
    area: [],
    sede: [],
    departamento: [],
    carrera: [],
    año: [],
  });

  // ===================================================
  // FILTROS PENDIENTES - SOLO MÓVIL
  // ===================================================

  const [
    filtrosPendientes,
    setFiltrosPendientes,
  ] = useState<Filtros>({
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

  const hasActiveFilters =
    filtros.tipoDocumento !==
      "Todos" ||
    filtros.estado !== "Todos" ||
    filtros.area.length > 0 ||
    filtros.sede.length > 0 ||
    filtros.departamento.length >
      0 ||
    filtros.carrera.length > 0 ||
    filtros.año.length > 0 ||
    searchQuery.trim() !== "";

  const searchRequest: SearchRequest = {
    query: searchQuery,

    filters:
      mapFrontendFiltersToAPI(
        filtros
      ),

    page: 1,

    page_size: 50,
  };

  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: searchError,
    refetch: refetchSearch,
  } = useSearch(
    searchRequest,
    hasActiveFilters
  );

  // ===================================================
  // TRANSFORMAR RESULTADOS
  // ===================================================

  const documentosFromSearch =
    useMemo(() => {
      if (
        !searchResults?.results
      ) {
        return [];
      }

      return searchResults.results.map(
        (
          item: SearchResultItem
        ) =>
          transformSearchResultToDocumento(
            item
          )
      );
    }, [searchResults]);

  // ===================================================
  // DOCUMENTOS ACTIVOS
  // ===================================================

  const documentosActivos =
    hasActiveFilters
      ? documentosFromSearch
      : documentosFromRegular;

  const isLoading =
    hasActiveFilters
      ? isLoadingSearch
      : isLoadingDocuments;

  const error =
    hasActiveFilters
      ? searchError
      : documentsError;

  const refetch =
    hasActiveFilters
      ? refetchSearch
      : refetchDocuments;

  // ===================================================
  // PANEL MÓVIL
  // ===================================================

  const [
    mostrarFiltros,
    setMostrarFiltros,
  ] = useState(false);

  // ===================================================
  // SCROLL DOCUMENTOS
  // ===================================================

  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

  const headerVisible =
    useScrollDirection(
      scrollContainerRef
    );

  // ===================================================
  // ACTUALIZAR TIPO DESDE URL
  // ===================================================

  useEffect(() => {
    setFiltros(
      (actual: Filtros) => ({
        ...actual,
        tipoDocumento: tipoUrl,
      })
    );

    setFiltrosPendientes(
      (actual: Filtros) => ({
        ...actual,
        tipoDocumento: tipoUrl,
      })
    );
  }, [tipoUrl]);

  // ===================================================
  // REFETCH SEARCH
  // ===================================================

  useEffect(() => {
    if (
      hasActiveFilters &&
      refetchSearch
    ) {
      refetchSearch();
    }
  }, [
    filtros,
    searchQuery,
    hasActiveFilters,
    refetchSearch,
  ]);

  // ===================================================
  // LIMPIAR FILTROS APLICADOS
  // ===================================================

  const limpiarFiltros = () => {
    const filtrosVacios: Filtros = {
      tipoDocumento: "Todos",
      estado: "Todos",
      area: [],
      sede: [],
      departamento: [],
      carrera: [],
      año: [],
    };

    setFiltros(
      filtrosVacios
    );
  };

  // ===================================================
  // ABRIR FILTROS MÓVILES
  // ===================================================

  const abrirFiltros = () => {
    setFiltrosPendientes({
      ...filtros,
      area: [
        ...filtros.area,
      ],
      sede: [
        ...filtros.sede,
      ],
      departamento: [
        ...filtros.departamento,
      ],
      carrera: [
        ...filtros.carrera,
      ],
      año: [
        ...filtros.año,
      ],
    });

    setMostrarFiltros(true);
  };

  // ===================================================
  // ACTUALIZAR FILTROS PENDIENTES
  // ===================================================

  const actualizarFiltrosPendientes = (
    nuevosFiltros: Filtros
  ) => {
    setFiltrosPendientes({
      ...nuevosFiltros,
      area: [
        ...nuevosFiltros.area,
      ],
      sede: [
        ...nuevosFiltros.sede,
      ],
      departamento: [
        ...nuevosFiltros.departamento,
      ],
      carrera: [
        ...nuevosFiltros.carrera,
      ],
      año: [
        ...nuevosFiltros.año,
      ],
    });
  };

  // ===================================================
  // LIMPIAR FILTROS PENDIENTES
  // ===================================================

  const limpiarFiltrosPendientes =
    () => {
      setFiltrosPendientes({
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
  // APLICAR FILTROS MÓVILES
  // ===================================================

  const aplicarFiltros = () => {
    setFiltros({
      ...filtrosPendientes,

      area: [
        ...filtrosPendientes.area,
      ],

      sede: [
        ...filtrosPendientes.sede,
      ],

      departamento: [
        ...filtrosPendientes.departamento,
      ],

      carrera: [
        ...filtrosPendientes.carrera,
      ],

      año: [
        ...filtrosPendientes.año,
      ],
    });

    setMostrarFiltros(false);

    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo(
        {
          top: 0,
          behavior: "smooth",
        }
      );
    });
  };

  // ===================================================
  // RENDER
  // ===================================================

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
                onFiltrosChange={
                  setFiltros
                }
                onLimpiarFiltros={
                  limpiarFiltros
                }
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
                  onChange={
                    setSearchQuery
                  }
                />

                {/* =================================================
                    BOTÓN FILTROS - SOLO MÓVIL
                ================================================= */}

                <button
                  type="button"
                  onClick={() => {
                    if (
                      mostrarFiltros
                    ) {
                      setMostrarFiltros(
                        false
                      );
                    } else {
                      abrirFiltros();
                    }
                  }}
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
                  onFiltrosChange={
                    setFiltros
                  }
                  onLimpiarFiltros={
                    limpiarFiltros
                  }
                  scrollable={false}
                />
              </div>

              {/* =================================================
                  DOCUMENTOS + FILTROS MÓVIL
              ================================================= */}

              <div
                ref={
                  scrollContainerRef
                }
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

                {/* =================================================
                    PANEL MÓVIL
                ================================================= */}

                {mostrarFiltros && (
                  <div
                    className="
                      mb-4
                      h-[65dvh]
                      max-h-[65dvh]
                      min-h-0
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      md:hidden
                    "
                  >
                    <FilterSidebar
                      filtros={
                        filtrosPendientes
                      }
                      onFiltrosChange={
                        actualizarFiltrosPendientes
                      }
                      onLimpiarFiltros={
                        limpiarFiltrosPendientes
                      }
                      onAplicarFiltros={
                        aplicarFiltros
                      }
                      scrollable={true}
                    />
                  </div>
                )}

                {/* =================================================
                    LISTA DE DOCUMENTOS
                ================================================= */}

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">

                      <div
                        className="
                          mb-4
                          h-8
                          w-8
                          animate-spin
                          rounded-full
                          border-4
                          border-slate-200
                          border-t-sidebar
                        "
                      />

                      <p className="text-sm text-slate-600">
                        Cargando documentos...
                      </p>

                    </div>
                  </div>
                ) : error ? (
                  <div
                    className="
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      p-6
                      text-center
                    "
                  >
                    <p className="text-sm text-red-800">
                      {error instanceof
                      Error
                        ? error.message
                        : "Error al cargar los documentos. Por favor, intenta nuevamente."}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        refetch()
                      }
                      className="
                        mt-4
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-red-700
                      "
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <DocumentList
                    documentos={
                      documentosActivos
                    }
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