export type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBox = ({
  value,
  onChange,
}: SearchBoxProps) => {
  return (
    <div className="relative">
      <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar en preguntas frecuentes..."
        aria-label="Buscar en preguntas frecuentes"
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          py-3
          pl-12
          pr-12
          text-gray-900
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-sky-900
          focus:ring-2
          focus:ring-sky-900/20
        "
      />

      {value.trim() !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            transition
            hover:text-gray-700
          "
        >
          <i className="pi pi-times" />
        </button>
      )}
    </div>
  );
};