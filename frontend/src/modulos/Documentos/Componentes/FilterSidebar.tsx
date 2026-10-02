import { useState } from "react";
import { FilterHeader } from "./FilterHeader";
import { FilterForm } from "./FilterForm";

export type Filtros = {
  tipoDocumento: string;
  estado: string;
  area: string[];
  sede: string[];
  departamento: string[];
  carrera: string[];
  año: string[];
};

type FilterSidebarProps = {
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
  onLimpiarFiltros: () => void;
  onAplicarFiltros?: () => void;
  scrollable?: boolean;
};

export const FilterSidebar = ({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
  onAplicarFiltros,
  scrollable = true,
}: FilterSidebarProps) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const actualizarFiltro = (
    campo: keyof Filtros,
    valor: string | string[]
  ) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    });
  };

  return (
    <aside
      className={`
        flex
        w-full
        flex-col
        bg-white
        border
        border-slate-200
        lg:w-72
        lg:border-y-0
        lg:border-l-0
        ${scrollable ? "h-full min-h-0" : ""}
      `}
    >
      {/* =====================================================
          TÍTULO
      ===================================================== */}

      <div
        className="
          shrink-0
          p-3
          pb-0
          sm:p-4
          sm:pb-0
          md:p-6
          md:pb-0
        "
      >
        <FilterHeader />
      </div>

      {/* =====================================================
          CONTENIDO DE FILTROS
          SOLO ESTA PARTE HACE SCROLL
      ===================================================== */}

      <div
        className={`
          min-h-0
          p-3
          pt-3
          sm:p-4
          sm:pt-3
          md:p-6
          md:pt-4
          ${
            scrollable
              ? "flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
              : ""
          }
        `}
      >
        <FilterForm
          filtros={filtros}
          onFiltroChange={actualizarFiltro}
          mostrarTodos={mostrarTodos}
        />
      </div>

      {/* =====================================================
          FOOTER DE FILTROS
          QUEDA FUERA DEL SCROLL
      ===================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-slate-200
          bg-white
          p-3
          sm:p-4
          md:p-5
        "
      >
        {/* Mostrar más / menos filtros */}

        <div className="mb-2">
          <button
            type="button"
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="
              w-full
              rounded-lg
              border
              border-sidebar
              px-3
              py-2.5
              text-sm
              font-semibold
              text-sidebar
              transition
              hover:bg-sidebar
              hover:text-white
            "
          >
            {mostrarTodos
              ? "Menos filtros"
              : "Mostrar más filtros"}
          </button>
        </div>

        {/* Limpiar + Aplicar */}

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={onLimpiarFiltros}
            className="
              flex-1
              rounded-lg
              border
              border-slate-300
              px-3
              py-2.5
              text-sm
              font-medium
              text-slate-600
              transition
              hover:border-red-300
              hover:bg-red-50
              hover:text-red-600
            "
          >
            Limpiar filtros
          </button>

          {onAplicarFiltros && (
            <button
              type="button"
              onClick={onAplicarFiltros}
              className="
                flex-1
                rounded-lg
                bg-sidebar
                px-3
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-slate-900
              "
            >
              Aplicar filtros
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};