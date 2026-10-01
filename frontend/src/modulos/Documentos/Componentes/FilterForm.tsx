import { useMemo, useState } from "react";
import type { Filtros } from "./FilterSidebar";
import {
  useFilterOptions,
  type FilterOption,
} from "../../../services/searchService";

// =====================================================
// AÑOS
// =====================================================

const AÑO_INICIO = 1972;
const AÑO_ACTUAL = new Date().getFullYear();

const años = Array.from(
  {
    length:
      AÑO_ACTUAL -
      AÑO_INICIO +
      1,
  },
  (_, index) =>
    String(AÑO_ACTUAL - index)
);

// =====================================================
// PROPS
// =====================================================

type FilterFormProps = {
  filtros: Filtros;

  onFiltroChange: (
    campo: keyof Filtros,
    valor: string | string[]
  ) => void;

  mostrarTodos: boolean;
};

// =====================================================
// SELECT
// =====================================================

type SelectFilterProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const SelectFilter = ({
  label,
  value,
  options,
  onChange,
}: SelectFilterProps) => {
  return (
    <div className="mb-4 sm:mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          text-sm
          text-slate-700
          outline-none
          transition
          focus:border-sidebar
          focus:ring-2
          focus:ring-sidebar/20
        "
      >
        {options.map((option: string) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// =====================================================
// AÑO
// =====================================================

type YearFilterProps = {
  selected: string[];
  onChange: (values: string[]) => void;
};

const YearFilter = ({
  selected,
  onChange,
}: YearFilterProps) => {
  const [busqueda, setBusqueda] = useState("");

  const añosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return años;
    }

    return años.filter((año: string) =>
      año.includes(busqueda.trim())
    );
  }, [busqueda]);

  const toggleAño = (año: string) => {
    if (selected.includes(año)) {
      onChange(
        selected.filter(
          (item: string) => item !== año
        )
      );
    } else {
      onChange([
        ...selected,
        año,
      ]);
    }
  };

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-slate-700">
          Año
        </label>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="
              shrink-0
              text-xs
              font-medium
              text-red-600
              hover:underline
            "
          >
            Limpiar
          </button>
        )}
      </div>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Buscar año..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
        className="
          mb-3
          h-10
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          text-sm
          text-slate-700
          outline-none
          transition
          focus:border-sidebar
          focus:ring-2
          focus:ring-sidebar/20
        "
      />

      <div
        className="
          max-h-33
          overflow-y-auto
          overflow-x-hidden
          pr-1
        "
      >
        <div
          className="
            grid
            grid-cols-3
            gap-2
            sm:grid-cols-4
          "
        >
          {añosFiltrados.map(
            (año: string) => {
              const seleccionado =
                selected.includes(año);

              return (
                <button
                  key={año}
                  type="button"
                  onClick={() =>
                    toggleAño(año)
                  }
                  className={`
                    min-w-0
                    rounded-md
                    border
                    px-2
                    py-2
                    text-sm
                    font-medium
                    transition
                    ${
                      seleccionado
                        ? "border-sidebar bg-sidebar text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  {año}
                </button>
              );
            }
          )}
        </div>

        {añosFiltrados.length === 0 && (
          <p className="py-3 text-center text-sm text-slate-500">
            No se encontraron años.
          </p>
        )}
      </div>
    </div>
  );
};

// =====================================================
// MULTISELECT
// =====================================================

type MultiSelectFilterProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
};

const MultiSelectFilter = ({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) => {
  const [abierto, setAbierto] =
    useState(false);

  const [busqueda, setBusqueda] =
    useState("");

  const opcionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return options;
    }

    return options.filter(
      (option: string) =>
        option
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
    );
  }, [options, busqueda]);

  const toggleOpcion = (
    opcion: string
  ) => {
    if (selected.includes(opcion)) {
      onChange(
        selected.filter(
          (item: string) =>
            item !== opcion
        )
      );
    } else {
      onChange([
        ...selected,
        opcion,
      ]);
    }
  };

  return (
    <div className="relative mb-4 sm:mb-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="block min-w-0 text-sm font-semibold text-slate-700">
          {label}
        </label>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="
              shrink-0
              text-xs
              font-medium
              text-red-600
              hover:underline
            "
          >
            Limpiar
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          setAbierto(!abierto)
        }
        className="
          flex
          min-h-11
          w-full
          items-center
          justify-between
          gap-2
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          py-2
          text-left
          text-sm
          text-slate-700
          outline-none
          transition
          hover:border-slate-400
          focus:border-sidebar
          focus:ring-2
          focus:ring-sidebar/20
        "
      >
        <span className="min-w-0 truncate">
          {selected.length === 0
            ? `Seleccionar ${label.toLowerCase()}`
            : `${selected.length} seleccionado${
                selected.length !== 1
                  ? "s"
                  : ""
              }`}
        </span>

        <span
          className={`
            shrink-0
            transition-transform
            ${
              abierto
                ? "rotate-180"
                : ""
            }
          `}
        >
          ▼
        </span>
      </button>

      {abierto && (
        <div
          className="
            absolute
            left-0
            z-50
            mt-1
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            p-2
            shadow-lg
          "
        >
          <input
            type="text"
            placeholder={`Buscar ${label.toLowerCase()}...`}
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            className="
              mb-2
              h-10
              w-full
              rounded-md
              border
              border-slate-300
              px-3
              text-sm
              outline-none
              focus:border-sidebar
              focus:ring-2
              focus:ring-sidebar/20
            "
          />

          <div className="max-h-48 overflow-y-auto">
            {opcionesFiltradas.map(
              (opcion: string) => {
                const seleccionado =
                  selected.includes(
                    opcion
                  );

                return (
                  <label
                    key={opcion}
                    className="
                      flex
                      cursor-pointer
                      items-start
                      gap-2
                      rounded-md
                      px-2
                      py-2
                      text-sm
                      text-slate-700
                      hover:bg-slate-100
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        seleccionado
                      }
                      onChange={() =>
                        toggleOpcion(
                          opcion
                        )
                      }
                      className="
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                        rounded
                        border-slate-300
                        accent-sidebar
                      "
                    />

                    <span className="leading-5">
                      {opcion}
                    </span>
                  </label>
                );
              }
            )}

            {opcionesFiltradas.length ===
              0 && (
              <p className="px-2 py-3 text-sm text-slate-500">
                No se encontraron resultados.
              </p>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected
            .slice(0, 3)
            .map(
              (item: string) => (
                <span
                  key={item}
                  className="
                    max-w-full
                    truncate
                    rounded-md
                    bg-sidebar/10
                    px-2
                    py-1
                    text-xs
                    text-sidebar
                  "
                >
                  {item}
                </span>
              )
            )}

          {selected.length > 3 && (
            <span
              className="
                rounded-md
                bg-slate-100
                px-2
                py-1
                text-xs
                text-slate-600
              "
            >
              +{selected.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// FILTER FORM
// =====================================================

export const FilterForm = ({
  filtros,
  onFiltroChange,
  mostrarTodos,
}: FilterFormProps) => {
  // ===================================================
  // API - OPCIONES
  // ===================================================

  const {
    data: filterOptions,
  } = useFilterOptions();

  // ===================================================
  // TIPO DOCUMENTO
  // ===================================================

  const tiposDocumento = useMemo(() => {
    if (
      filterOptions?.tipos_documento
    ) {
      return [
        "Todos",
        ...filterOptions.tipos_documento.map(
          (opt: FilterOption) =>
            opt.nombre
        ),
      ];
    }

    return [
      "Todos",
      "Reglamento",
      "Decreto",
      "Acta",
      "Convenio",
      "Elección",
    ];
  }, [filterOptions]);

  // ===================================================
  // ESTADOS
  // ===================================================

  const estados = useMemo(() => {
    if (
      filterOptions?.estados_vigencia
    ) {
      return [
        "Todos",
        ...filterOptions.estados_vigencia.map(
          (opt: FilterOption) =>
            opt.nombre
        ),
      ];
    }

    return [
      "Todos",
      "Vigente",
      "Reemplazado",
      "Derogado",
    ];
  }, [filterOptions]);

  // ===================================================
  // ÁREAS
  // ===================================================

  const areas = useMemo(() => {
    if (
      filterOptions?.tipos_area
    ) {
      return filterOptions.tipos_area.map(
        (opt: FilterOption) =>
          opt.nombre
      );
    }

    return [
      "Académica",
      "Administrativa",
      "Estudiantil",
      "Disciplinaria",
    ];
  }, [filterOptions]);

  // ===================================================
  // SEDES
  // ===================================================

  const sedes = useMemo(() => {
    if (
      filterOptions?.sedes_campus
    ) {
      return filterOptions.sedes_campus.map(
        (opt: FilterOption) =>
          opt.nombre
      );
    }

    return [
      "Casa Central Valparaíso",
      "Campus San Joaquín",
      "Campus Vitacura",
      "Sede Viña del Mar",
      "Sede Concepción",
    ];
  }, [filterOptions]);

  // ===================================================
  // DEPARTAMENTOS
  // ===================================================

  const departamentos = useMemo(() => {
    if (
      filterOptions?.departamentos
    ) {
      return filterOptions.departamentos.map(
        (opt: FilterOption) =>
          opt.nombre
      );
    }

    return [
      "Departamento de Aeronáutica",
      "Departamento de Arquitectura",
      "Departamento de Informática",
      "Departamento de Electrónica",
      "Departamento de Industrias",
    ];
  }, [filterOptions]);

  // ===================================================
  // CARRERAS
  // ===================================================

  const carreras = useMemo(() => {
    if (
      filterOptions?.carreras
    ) {
      return filterOptions.carreras.map(
        (opt: FilterOption) =>
          opt.nombre
      );
    }

    return [
      "Arquitectura",
      "Ingeniería Civil",
      "Ingeniería Civil Informática",
      "Ingeniería Civil Electrónica",
      "Ingeniería Civil Mecánica",
    ];
  }, [filterOptions]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="mt-2 w-full">

      {/* =================================================
          FILTROS PRINCIPALES
      ================================================= */}

      <SelectFilter
        label="Tipo de documento"
        value={filtros.tipoDocumento}
        options={tiposDocumento}
        onChange={(value: string) =>
          onFiltroChange(
            "tipoDocumento",
            value
          )
        }
      />

      <SelectFilter
        label="Estado"
        value={filtros.estado}
        options={estados}
        onChange={(value: string) =>
          onFiltroChange(
            "estado",
            value
          )
        }
      />

      <YearFilter
        selected={filtros.año}
        onChange={(values: string[]) =>
          onFiltroChange(
            "año",
            values
          )
        }
      />

      {/* =================================================
          FILTROS AVANZADOS
      ================================================= */}

      {mostrarTodos && (
        <div
          className="
            border-t
            border-slate-200
            pt-5
          "
        >
          <MultiSelectFilter
            label="Área"
            options={areas}
            selected={filtros.area}
            onChange={(values: string[]) =>
              onFiltroChange(
                "area",
                values
              )
            }
          />

          <MultiSelectFilter
            label="Sede"
            options={sedes}
            selected={filtros.sede}
            onChange={(values: string[]) =>
              onFiltroChange(
                "sede",
                values
              )
            }
          />

          <MultiSelectFilter
            label="Departamento"
            options={departamentos}
            selected={
              filtros.departamento
            }
            onChange={(values: string[]) =>
              onFiltroChange(
                "departamento",
                values
              )
            }
          />

          <MultiSelectFilter
            label="Carrera"
            options={carreras}
            selected={filtros.carrera}
            onChange={(values: string[]) =>
              onFiltroChange(
                "carrera",
                values
              )
            }
          />
        </div>
      )}
    </div>
  );
};