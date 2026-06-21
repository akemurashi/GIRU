import { FilterHeader } from "./FilterHeader";
import { FilterForm } from "./FilterForm";

type FilterSidebarProps = {
  tipoSeleccionado: string;
  onTipoChange: (tipo: string) => void;
};

export const FilterSidebar = ({
  tipoSeleccionado,
  onTipoChange,
}: FilterSidebarProps) => {
  return (
    <aside className="w-72 bg-white border-r p-6">

      <FilterHeader />

      <FilterForm
        tipoSeleccionado={tipoSeleccionado}
        onTipoChange={onTipoChange}
      />

    </aside>
  );
};