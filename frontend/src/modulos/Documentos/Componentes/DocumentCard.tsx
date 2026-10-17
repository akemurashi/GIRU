import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService, type User } from "../../../services/authService";
import { RelacionesModal } from "./RelacionesModal";

type DocumentCardProps = {
  id: string | number;
  titulo: string;
  tipo: string;
  fecha: string;
  area: string;
  estado: string;
  descripcion: string;
};

export const DocumentCard = ({
  id,
  titulo,
  tipo,
  fecha,
  area,
  estado,
  descripcion,
}: DocumentCardProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showRelaciones, setShowRelaciones] = useState(false);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

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

        {user?.role === "admin" && (
          <button
            onClick={() => navigate(`/administracion?docId=${id}`)}
            className="
              rounded-lg
              border
              border-amber-400
              text-amber-500
              hover:bg-amber-50
              px-4
              py-2
            "
          >
            <i className="pi pi-pencil mr-2"></i> Editar
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowRelaciones(true)}
          className="
            flex
            items-center
            rounded-lg
            border
            border-slate-300
            px-4
            py-2
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          <i className="pi pi-share-alt mr-2 text-sidebar" />
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

      {showRelaciones && (
        <RelacionesModal
          documentId={String(id)}
          onClose={() => setShowRelaciones(false)}
        />
      )}
    </article>
  );
};
