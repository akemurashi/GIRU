import { useState } from "react";
import { PdfModal } from "./PdfModal";

type Documento = {
  id: number;
  titulo: string;
  tipo: string;
  estado: string;
  fecha: string;
  organismo: string;
  descripcion: string;
  archivo: string;
};

type DocumentListProps = {
  documentos: Documento[];
};

const obtenerEstiloEstado = (estado: string) => {
  const estadoNormalizado = estado
    .trim()
    .toLowerCase();

  switch (estadoNormalizado) {
    case "vigente":
      return {
        clase:
          "bg-green-100 text-green-700",
      };

    case "derogado":
      return {
        clase:
          "bg-red-100 text-red-700",
      };

    case "modificado":
      return {
        clase:
          "bg-yellow-100 text-yellow-700",
      };

    default:
      return {
        clase:
          "bg-slate-100 text-slate-600",
      };
  }
};

export const DocumentList = ({
  documentos,
}: DocumentListProps) => {
  const [
    pdfSeleccionado,
    setPdfSeleccionado,
  ] = useState<number | null>(null);

  return (
    <>
      <div className="w-full">
        <p className="mb-3 text-sm text-slate-400">
          {documentos.length} documentos encontrados
        </p>

        <div className="space-y-3 pb-6">
          {documentos.map((doc) => {
            const estiloEstado =
              obtenerEstiloEstado(
                doc.estado
              );

            return (
              <article
                key={doc.id}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-3
                  shadow-sm
                  md:p-6
                "
              >
                {/* =================================================
                    TÍTULO + ESTADO
                ================================================= */}

                <div
                  className="
                    flex
                    flex-col
                    gap-2
                    md:flex-row
                    md:items-start
                  "
                >
                  <h3
                    className="
                      min-w-0
                      flex-1
                      wrap-break-word
                      text-base
                      font-semibold
                      text-slate-900
                      md:text-lg
                    "
                  >
                    {doc.titulo}
                  </h3>

                  {/* ESTADO */}

                  <span
                    className={`
                      w-fit
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${estiloEstado.clase}
                    `}
                  >
                    {doc.estado}
                  </span>
                </div>

                {/* =================================================
                    INFORMACIÓN
                ================================================= */}

                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    gap-2
                    text-xs
                    text-slate-400
                    md:text-sm
                  "
                >
                  <span>
                    {doc.tipo}
                  </span>

                  <span>
                    {doc.fecha}
                  </span>

                  <span>
                    {doc.organismo}
                  </span>
                </div>

                {/* =================================================
                    DESCRIPCIÓN
                ================================================= */}

                <p
                  className="
                    mt-2
                    wrap-break-word
                    text-sm
                    text-slate-600
                  "
                >
                  {doc.descripcion}
                </p>

                {/* =================================================
                    BOTÓN
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setPdfSeleccionado(
                      doc.id
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-lg
                    bg-sidebar
                    py-2
                    text-sm
                    text-white
                    transition
                    hover:opacity-90
                    md:w-auto
                    md:px-4
                  "
                >
                  Ver documento
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* =================================================
          PDF
      ================================================= */}

      {pdfSeleccionado !== null && (
        <PdfModal
          documentId={
            pdfSeleccionado
          }
          onClose={() =>
            setPdfSeleccionado(null)
          }
        />
      )}
    </>
  );
};