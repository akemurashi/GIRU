
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  type ComponentProps,
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
  useSearch,
  mapFrontendFiltersToAPI,
  type SearchRequest,
  type SearchResultItem,
} from "../../../services/searchService";

// =====================================================
// CONFIGURACIÓN DE PAGINACIÓN
// =====================================================

const DOCUMENTOS_POR_PAGINA = 15;

// =====================================================
// TIPO DE DOCUMENTO
// =====================================================

type Documento = ComponentProps<
  typeof DocumentList
>["documentos"][number];

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
// TRANSFORMAR RESULTADOS DE BÚSQUEDA
// =====================================================

const transformSearchResultToDocumento = (
  searchResult: SearchResultItem
): Documento => {
  const fecha = searchResult.creacion
    ? new Date(searchResult.creacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : "Sin fecha";

  return {
    id: searchResult.documentid,
    titulo: searchResult.titulo,
    tipo:
      searchResult.tipodocumento ||
      searchResult.nommetadato ||
      "Documento",
    estado: searchResult.estadovigencia || "Vigente",
    fecha,
    organismo: searchResult.nommetadato || "Universidad",
    descripcion: searchResult.excerpt || "",
    archivo: `/Pdf/documento_${searchResult.documentid}.pdf`,
  };
};

// =====================================================
// GENERAR NÚMEROS DE PÁGINA
// =====================================================

type ElementoPaginacion = number | "...";

const generarNumerosPagina = (
  paginaActual: number,
  totalPaginas: number
): ElementoPaginacion[] => {
  if (totalPaginas <= 7) {
    return Array.from(
      { length: totalPaginas },
      (_, indice) => indice + 1
    );
  }

  if (paginaActual <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPaginas];
  }

  if (paginaActual >= totalPaginas - 3) {
    return [
      1,
      "...",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "...",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "...",
    totalPaginas,
  ];
};

// =====================================================
// PÁGINA
// =====================================================

export default function PaginaDocumentos() {
  const [searchParams] = useSearchParams();

  const tipoUrl = searchParams.get("tipo") || "Todos";

  // ===================================================
  // BÚSQUEDA
  // ===================================================

  const [searchQuery, setSearchQuery] = useState("");

  // ===================================================
  // PAGINACIÓN
  // ===================================================

  const [paginaActual, setPaginaActual] = useState(1);

  // ===================================================
  // FILTROS APLICADOS
  // ===================================================

  const [filtros, setFiltros] = useState<Filtros>({
    tipoDocumento: tipoUrl,
    estado: "Todos",
    area: [],
    sede: [],
    departamento: [],
    carrera: [],
    año: [],
  });

  // ===================================================
  // FILTROS PENDIENTES - MÓVIL
  // ===================================================

  const [filtrosPendientes, setFiltrosPendientes] =
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
  // DETERMINAR SI HAY FILTROS ACTIVOS
  // ===================================================


  // ===================================================
  // SOLICITUD DE BÚSQUEDA
  // Se utiliza para todos los listados.
  // ===================================================

  const searchRequest: SearchRequest = {
    query: searchQuery.trim(),
    filters: mapFrontendFiltersToAPI(filtros),
    page: paginaActual,
    page_size: DOCUMENTOS_POR_PAGINA,
  };

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useSearch(searchRequest, true);

  // ===================================================
  // TRANSFORMAR RESULTADOS DE BÚSQUEDA
  // ===================================================

  const documentosActivos = useMemo<Documento[]>(() => {
    if (!searchResults?.results) {
      return [];
    }

    return searchResults.results.map(
      (item: SearchResultItem) =>
        transformSearchResultToDocumento(item)
    );
  }, [searchResults]);

  // ===================================================
  // TOTAL DE DOCUMENTOS Y PÁGINAS
  // ===================================================

  const totalDocumentos = searchResults?.total ?? 0;

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalDocumentos / DOCUMENTOS_POR_PAGINA)
  );

  const hayPaginaAnterior = paginaActual > 1;

  const hayPaginaSiguiente = paginaActual < totalPaginas;

  const primerDocumento =
    totalDocumentos > 0
      ? (paginaActual - 1) * DOCUMENTOS_POR_PAGINA + 1
      : 0;

  const ultimoDocumento = Math.min(
    paginaActual * DOCUMENTOS_POR_PAGINA,
    totalDocumentos
  );

  const paginasVisibles = useMemo(
    () => generarNumerosPagina(paginaActual, totalPaginas),
    [paginaActual, totalPaginas]
  );

  // ===================================================
  // PANEL MÓVIL
  // ===================================================

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // ===================================================
  // SCROLL DE DOCUMENTOS
  // ===================================================

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const headerVisible = useScrollDirection(scrollContainerRef);

  // ===================================================
  // VOLVER AL INICIO DE LA LISTA
  // ===================================================

  const volverAlInicio = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // ACTUALIZAR TIPO DESDE LA URL
  // ===================================================

  useEffect(() => {
    setFiltros((actual) => ({
      ...actual,
      tipoDocumento: tipoUrl,
    }));

    setFiltrosPendientes((actual) => ({
      ...actual,
      tipoDocumento: tipoUrl,
    }));

    setPaginaActual(1);
  }, [tipoUrl]);

  // ===================================================
  // REINICIAR PAGINACIÓN AL CAMBIAR BÚSQUEDA O FILTROS
  // ===================================================

  const filtrosKey = JSON.stringify(filtros);

  useEffect(() => {
    setPaginaActual(1);
  }, [searchQuery, filtrosKey]);

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

    setFiltros(filtrosVacios);
    setPaginaActual(1);
  };

  // ===================================================
  // ABRIR FILTROS MÓVILES
  // ===================================================

  const abrirFiltros = () => {
    setFiltrosPendientes({
      ...filtros,
      area: [...filtros.area],
      sede: [...filtros.sede],
      departamento: [...filtros.departamento],
      carrera: [...filtros.carrera],
      año: [...filtros.año],
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
      area: [...nuevosFiltros.area],
      sede: [...nuevosFiltros.sede],
      departamento: [...nuevosFiltros.departamento],
      carrera: [...nuevosFiltros.carrera],
      año: [...nuevosFiltros.año],
    });
  };

  // ===================================================
  // LIMPIAR FILTROS PENDIENTES
  // ===================================================

  const limpiarFiltrosPendientes = () => {
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
      area: [...filtrosPendientes.area],
      sede: [...filtrosPendientes.sede],
      departamento: [...filtrosPendientes.departamento],
      carrera: [...filtrosPendientes.carrera],
      año: [...filtrosPendientes.año],
    });

    setPaginaActual(1);
    setMostrarFiltros(false);

    requestAnimationFrame(volverAlInicio);
  };

  // ===================================================
  // CAMBIAR DE PÁGINA
  // ===================================================

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return;
    }

    if (nuevaPagina === paginaActual) {
      return;
    }

    setPaginaActual(nuevaPagina);
    volverAlInicio();
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <SidebarLayout>
      <div className="flex h-dvh flex-col overflow-hidden bg-white">
        <main className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full flex-col xl:flex-row">
            {/* SIDEBAR DE FILTROS - PC */}

            <aside className="hidden shrink-0 border-r border-slate-200 xl:block">
              <FilterSidebar
                filtros={filtros}
                onFiltrosChange={setFiltros}
                onLimpiarFiltros={limpiarFiltros}
              />
            </aside>

            {/* CONTENIDO PRINCIPAL */}

            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              {/* HEADER */}

              <header
                className={`
                  shrink-0
                  relative
                  z-30
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
                      ? "max-h-55 opacity-100 overflow-visible"
                      : "max-h-0 border-b-0! py-0! opacity-0 overflow-hidden pointer-events-none"
                  }
                `}
              >
                <h1 className="mb-3 text-xl font-bold text-slate-900 md:text-3xl">
                  Buscar documentos
                </h1>

                <SearchBox
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {/* BOTÓN DE FILTROS - MÓVIL */}

                <button
                  type="button"
                  onClick={() => {
                    if (mostrarFiltros) {
                      setMostrarFiltros(false);
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
                    className={`transition-transform ${
                      mostrarFiltros ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
              </header>

              {/* FILTROS - TABLET */}

              <div className="hidden min-h-0 shrink-0 border-b border-slate-200 bg-slate-50 md:block xl:hidden">
                <FilterSidebar
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  onLimpiarFiltros={limpiarFiltros}
                  scrollable={false}
                />
              </div>

              {/* DOCUMENTOS Y FILTROS MÓVILES */}

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
                {/* PANEL DE FILTROS MÓVIL */}

                {mostrarFiltros && (
                  <div className="mb-4 h-[65dvh] max-h-[65dvh] min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:hidden">
                    <FilterSidebar
                      filtros={filtrosPendientes}
                      onFiltrosChange={actualizarFiltrosPendientes}
                      onLimpiarFiltros={limpiarFiltrosPendientes}
                      onAplicarFiltros={aplicarFiltros}
                      scrollable={true}
                    />
                  </div>
                )}

                {/* ESTADO DE CARGA */}

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sidebar" />

                      <p className="text-sm text-slate-600">
                        Cargando documentos...
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  /* ERROR */

                  <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-800">
                      {error instanceof Error
                        ? error.message
                        : "Error al cargar los documentos. Por favor, intenta nuevamente."}
                    </p>

                    <button
                      type="button"
                      onClick={() => refetch()}
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
                ) : documentosActivos.length === 0 ? (
                  /* SIN RESULTADOS */

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="font-medium text-slate-800">
                      No se encontraron documentos
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Se encontraron {totalDocumentos} documentos.
                      Prueba modificando la búsqueda o los filtros.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* CONTADOR */}

                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-slate-600">
                        Mostrando{" "}
                        <span className="font-semibold text-slate-900">
                          {primerDocumento}–{ultimoDocumento}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-slate-900">
                          {totalDocumentos}
                        </span>{" "}
                        documentos encontrados
                      </p>

                      <p className="text-xs text-slate-500">
                        {DOCUMENTOS_POR_PAGINA} por página
                      </p>
                    </div>

                    {/* LISTA DE DOCUMENTOS */}

                    <DocumentList documentos={documentosActivos} />

                    {/* CONTROLES DE PAGINACIÓN */}

                    <nav
                      aria-label="Paginación de documentos"
                      className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-5"
                    >
                      {/* ANTERIOR */}

                      <button
                        type="button"
                        onClick={() =>
                          cambiarPagina(paginaActual - 1)
                        }
                        disabled={!hayPaginaAnterior || isLoading}
                        className="
                          rounded-lg
                          border
                          border-slate-300
                          bg-white
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-slate-700
                          transition
                          hover:bg-slate-100
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        Anterior
                      </button>

                      {/* NÚMEROS DE PÁGINA */}

                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {paginasVisibles.map((pagina, indice) => {
                          if (pagina === "...") {
                            return (
                              <span
                                key={`ellipsis-${indice}`}
                                aria-hidden="true"
                                className="px-1.5 py-2 text-sm text-slate-500"
                              >
                                …
                              </span>
                            );
                          }

                          const esPaginaActual =
                            pagina === paginaActual;

                          return (
                            <button
                              key={pagina}
                              type="button"
                              onClick={() => cambiarPagina(pagina)}
                              disabled={isLoading || esPaginaActual}
                              aria-label={`Ir a la página ${pagina}`}
                              aria-current={
                                esPaginaActual ? "page" : undefined
                              }
                              className={`
                                flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                px-2.5
                                text-sm
                                font-medium
                                transition
                                disabled:cursor-default
                                ${
                                  esPaginaActual
                                    ? "border-sidebar bg-sidebar text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                }
                                disabled:opacity-100
                              `}
                            >
                              {pagina}
                            </button>
                          );
                        })}
                      </div>

                      {/* SIGUIENTE */}

                      <button
                        type="button"
                        onClick={() =>
                          cambiarPagina(paginaActual + 1)
                        }
                        disabled={!hayPaginaSiguiente || isLoading}
                        className="
                          rounded-lg
                          border
                          border-sidebar
                          bg-sidebar
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:opacity-90
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        Siguiente
                      </button>

                      <span className="w-full text-center text-xs text-slate-500">
                        Página {paginaActual} de {totalPaginas}
                      </span>
                    </nav>
                  </>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
