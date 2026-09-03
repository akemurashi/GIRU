
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
};

export const FilterSidebar = ({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
}: FilterSidebarProps) => {
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
      className="
        flex
        h-full
        w-full
        flex-col
        bg-white
        border
        border-slate-200
        lg:w-72
        lg:border-y-0
        lg:border-l-0
      "
    >
      {/* Título */}
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

      {/* Contenido */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-3
          pt-3
          sm:p-4
          sm:pt-3
          md:p-6
          md:pt-4
        "
      >
        <FilterForm
          filtros={filtros}
          onFiltroChange={actualizarFiltro}
          onLimpiarFiltros={onLimpiarFiltros}
        />
      </div>
    </aside>
  );
};

