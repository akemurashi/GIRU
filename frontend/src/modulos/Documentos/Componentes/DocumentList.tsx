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

export const DocumentList = ({
  documentos,
}: DocumentListProps) => {
  const [pdfSeleccionado, setPdfSeleccionado] =
    useState<string | null>(null);

  return (
    <>
      <div className="flex-1 p-8">

        <p className="text-sm text-slate-500 mb-4">
          {documentos.length} documentos encontrados
        </p>

        {documentos.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border rounded-xl p-6 mb-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">
                {doc.titulo}
              </h3>

              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                {doc.estado}
              </span>
            </div>

            <div className="flex gap-4 text-sm text-slate-500 mb-3">
              <span>{doc.tipo}</span>
              <span>{doc.fecha}</span>
              <span>{doc.organismo}</span>
            </div>

            <p className="text-slate-600 mb-4">
              {doc.descripcion}
            </p>

            <button
              onClick={() =>
                setPdfSeleccionado(doc.archivo)
              }
              className="bg-sidebar text-white px-4 py-2 rounded-lg"
            >
              Ver documento
            </button>
          </div>
        ))}
      </div>

      {pdfSeleccionado && (
        <PdfModal
          archivo={pdfSeleccionado}
          onClose={() =>
            setPdfSeleccionado(null)
          }
        />
      )}
    </>
  );
};