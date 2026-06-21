type FilterFormProps = {
  tipoSeleccionado: string;
  onTipoChange: (tipo: string) => void;
};

export const FilterForm = ({
  tipoSeleccionado,
  onTipoChange,
}: FilterFormProps) => {
  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-2 text-sm font-medium">
          Tipo de documento
        </label>

        <select
          value={tipoSeleccionado}
          onChange={(e) => onTipoChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="Todos">Todos</option>
          <option value="Reglamento">Reglamento</option>
          <option value="Normativa">Normativa</option>
          <option value="Acta">Acta</option>
          <option value="Decreto">Decreto</option>
          <option value="Convenio">Convenio</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onTipoChange("Todos")}
        className="w-full border rounded-lg py-2"
      >
        Limpiar filtros
      </button>

    </div>
  );
};