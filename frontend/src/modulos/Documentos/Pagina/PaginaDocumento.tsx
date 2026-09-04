import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../../Compartido/Sidebar";
import { SearchBox } from "../../Compartido/Busqueda";

import {
  FilterSidebar,
  type Filtros,
} from "../Componentes/FilterSidebar";

import { DocumentList } from "../Componentes/DocumentList";

import {
  documentos,
  type Documento,
} from "../Componentes/DocumentosParaVer";

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
  // FILTROS APLICADOS
  // ===================================================

  const documentosFiltrados =
    filtrarDocumentos(
      documentos,
      filtros
    );

  return (
    <div
      className="
        flex
        h-dvh
        flex-col
        overflow-hidden
        bg-white
        md:block
      "
    >
      {/* SIDEBAR PRINCIPAL */}
      <Sidebar />

      <main
        className="
          min-h-0
          flex-1
          overflow-hidden
          md:h-screen
          md:pl-64
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
                Solo título + buscador + botón toggle.
                El panel de filtros ya NO vive aquí,
                para que el header nunca crezca más
                que el espacio disponible y se corte.
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
                    ? "max-h-[220px] opacity-100"
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

              <SearchBox />

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

                El panel de filtros móvil ahora vive AQUÍ,
                dentro de la única zona que realmente
                sabe manejar su scroll (flex-1 min-h-0
                overflow-y-auto), así nunca se corta.
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
                    onFiltrosChange={setFiltros}
                    onLimpiarFiltros={
                      limpiarFiltros
                    }
                    scrollable={false}
                  />
                </div>
              )}

              <DocumentList
                documentos={
                  documentosFiltrados
                }
              />
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}