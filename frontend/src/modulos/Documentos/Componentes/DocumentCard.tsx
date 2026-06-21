type DocumentCardProps = {
  titulo: string;
  tipo: string;
  fecha: string;
  area: string;
  estado: string;
  descripcion: string;
};

export const DocumentCard = ({
  titulo,
  tipo,
  fecha,
  area,
  estado,
  descripcion,
}: DocumentCardProps) => {
  return (
    <article
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-6
      "
    >
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-lg font-semibold">
          {titulo}
        </h3>

        <span
          className="
            rounded-full
            bg-green-100
            px-3
            py-1
            text-xs
            text-green-700
          "
        >
          {estado}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-500">
        <span>{tipo}</span>
        <span>{fecha}</span>
        <span>{area}</span>
      </div>

      <p className="mb-4 text-slate-600">
        {descripcion}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="
            rounded-lg
            bg-sidebar
            px-4
            py-2
            text-white
          "
        >
          Ver documento
        </button>

        <button
          className="
            rounded-lg
            border
            px-4
            py-2
          "
        >
          Ver relaciones
        </button>

        <button
          className="
            rounded-lg
            border
            px-4
            py-2
          "
        >
          Consultar con Don Fede
        </button>
      </div>
    </article>
  );
};