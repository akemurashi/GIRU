
import { useMemo, useState } from "react";
import type { Filtros } from "./FilterSidebar";

const tiposDocumento = [
  "Todos",
  "Reglamento",
  "Normativa",
  "Resolución",
  "Instructivo",
];

const estados = [
  "Todos",
  "Vigente",
  "Reemplazado",
  "Derogado",
  "Complementario",
];

const areas = [
  "Académica",
  "Administrativa",
  "Estudiantil",
  "Disciplinaria",
];

const sedes = [
  "Casa Central Valparaíso",
  "Campus San Joaquín",
  "Campus Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
];

const departamentos = [
  "Departamento de Aeronáutica",
  "Departamento de Arquitectura",
  "Departamento de Ciencias (Sede Viña del Mar)",
  "Departamento de Ciencias (Sede Concepción)",
  "Departamento de Construcción y Prevención de Riesgos (Sede Viña del Mar)",
  "Departamento de Construcción y Prevención de Riesgos (Sede Concepción)",
  "Departamento de Diseño y Manufactura",
  "Departamento de Educación Física, Deportes y Recreación",
  "Departamento de Electricidad",
  "Departamento de Electrónica",
  "Departamento de Electrónica e Informática",
  "Departamento de Electrotecnia e Informática",
  "Departamento de Estudios Humanísticos",
  "Departamento de Física",
  "Departamento de Industrias",
  "Departamento de Informática",
  "Departamento de Ingeniería Comercial",
  "Departamento de Ingeniería Eléctrica",
  "Departamento de Ingeniería en Diseño",
  "Departamento de Ingeniería Mecánica",
  "Departamento de Ingeniería de Minas, Metalurgia y Materiales",
  "Departamento de Ingeniería Química y Ambiental",
  "Departamento de Matemática",
  "Departamento de Mecánica (Sede Viña del Mar)",
  "Departamento de Mecánica (Sede Concepción)",
  "Departamento de Obras Civiles",
  "Departamento de Química",
  "Departamento de Química y Medio Ambiente (Sede Viña del Mar)",
  "Departamento de Química y Medio Ambiente (Sede Concepción)",
];

const carreras = [
  "Arquitectura",
  "Construcción Civil",
  "Ingeniería Civil",
  "Ingeniería Civil Ambiental",
  "Ingeniería Civil de Minas",
  "Ingeniería Civil Eléctrica",
  "Ingeniería Civil Electrónica",
  "Ingeniería Civil en Biotecnología",
  "Ingeniería Civil Física",
  "Ingeniería Civil Industrial",
  "Ingeniería Civil Informática",
  "Ingeniería Civil Matemática",
  "Ingeniería Civil Mecánica",
  "Ingeniería Civil Metalúrgica",
  "Ingeniería Civil Plan Común",
  "Ingeniería Civil Química",
  "Ingeniería Civil Telemática",
  "Ingeniería Comercial",
  "Ingeniería en Aviación Comercial",
  "Ingeniería en Biotecnología",
  "Ingeniería en Diseño de Productos",
  "Ingeniería en Fabricación y Diseño Industrial",
  "Ingeniería en Informática",
  "Ingeniería en Mantenimiento Industrial",
  "Ingeniería en Prevención de Riesgos Laborales y Ambientales",
  "Licenciatura en Astrofísica",
  "Licenciatura en Ciencias, mención Química",
  "Licenciatura en Física",
  "Químico",
  "Dibujante Proyectista",
  "Administración de Empresas",
  "Alimentos",
  "Automatización y Control",
  "Biotecnología",
  "Ciencia de Datos",
  "Construcción",
  "Control del Medio Ambiente",
  "Electricidad",
  "Electrónica",
  "Energías Renovables",
  "Informática",
  "Mantenimiento Aeronáutico",
  "Mantenimiento Industrial",
  "Mecánica Automotriz",
  "Mecánica Industrial",
  "Minería y Metalurgia",
  "Proyectos de Ingeniería",
  "Química mención Analítica",
  "Química mención Industrial",
  "Robótica y Mecatrónica",
  "Telecomunicaciones y Redes",
];

const años = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
];

type FilterFormProps = {
  filtros: Filtros;
  onFiltroChange: (
    campo: keyof Filtros,
    valor: string | string[]
  ) => void;
  onLimpiarFiltros: () => void;
};

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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

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

    return años.filter((año) =>
      año.includes(busqueda.trim())
    );
  }, [busqueda]);

  const toggleAño = (año: string) => {
    if (selected.includes(año)) {
      onChange(
        selected.filter((item) => item !== año)
      );
    } else {
      onChange([...selected, año]);
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
        onChange={(e) => setBusqueda(e.target.value)}
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
          {añosFiltrados.map((año) => {
            const seleccionado =
              selected.includes(año);

            return (
              <button
                key={año}
                type="button"
                onClick={() => toggleAño(año)}
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
          })}
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
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const opcionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return options;
    }

    return options.filter((option) =>
      option
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [options, busqueda]);

  const toggleOpcion = (opcion: string) => {
    if (selected.includes(opcion)) {
      onChange(
        selected.filter((item) => item !== opcion)
      );
    } else {
      onChange([...selected, opcion]);
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
        onClick={() => setAbierto(!abierto)}
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
                selected.length !== 1 ? "s" : ""
              }`}
        </span>

        {/* SE MANTIENE EL SÍMBOLO DE LOS SELECTORES */}
        <span
          className={`
            shrink-0
            transition-transform
            ${abierto ? "rotate-180" : ""}
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
              setBusqueda(e.target.value)
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
            {opcionesFiltradas.map((opcion) => {
              const seleccionado =
                selected.includes(opcion);

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
                    checked={seleccionado}
                    onChange={() =>
                      toggleOpcion(opcion)
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
            })}

            {opcionesFiltradas.length === 0 && (
              <p className="px-2 py-3 text-sm text-slate-500">
                No se encontraron resultados.
              </p>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.slice(0, 3).map((item) => (
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
          ))}

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

export const FilterForm = ({
  filtros,
  onFiltroChange,
  onLimpiarFiltros,
}: FilterFormProps) => {
  const [mostrarTodos, setMostrarTodos] =
    useState(false);

  return (
    <div className="mt-2 w-full">

      {/* =========================
          FILTROS PRINCIPALES
         ========================= */}

      <SelectFilter
        label="Tipo de documento"
        value={filtros.tipoDocumento}
        options={tiposDocumento}
        onChange={(value) =>
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
        onChange={(value) =>
          onFiltroChange(
            "estado",
            value
          )
        }
      />

      <YearFilter
        selected={filtros.año}
        onChange={(values) =>
          onFiltroChange(
            "año",
            values
          )
        }
      />

      {/* =========================
          MOSTRAR MÁS FILTROS
         ========================= */}

      {!mostrarTodos && (
        <div
          className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={() => setMostrarTodos(true)}
            className="
              flex-1
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
            Mostrar más filtros
          </button>
        </div>
      )}

      {/* =========================
          FILTROS AVANZADOS
         ========================= */}

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
            onChange={(values) =>
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
            onChange={(values) =>
              onFiltroChange(
                "sede",
                values
              )
            }
          />

          <MultiSelectFilter
            label="Departamento"
            options={departamentos}
            selected={filtros.departamento}
            onChange={(values) =>
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
            onChange={(values) =>
              onFiltroChange(
                "carrera",
                values
              )
            }
          />

          {/* =========================
              BOTONES INFERIORES
             ========================= */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-2
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={() => setMostrarTodos(false)}
              className="
                flex-1
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
              Menos filtros
            </button>

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
                sm:flex-none
              "
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

