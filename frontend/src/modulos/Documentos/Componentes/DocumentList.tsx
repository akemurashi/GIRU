import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PdfModal } from "./PdfModal";
import { RelacionesModal } from "./RelacionesModal";
import { authService, type User } from "../../../services/authService";

type Documento = {
  id: number | string;
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
  documentoSeleccionadoId?: string | null;
};

const obtenerEstiloEstado = (estado: string) => {
  const estadoNormalizado = estado.trim().toLowerCase();
  switch (estadoNormalizado) {
    case "vigente": return { clase: "bg-green-100 text-green-700" };
    case "derogado": return { clase: "bg-red-100 text-red-700" };
    case "modificado": return { clase: "bg-yellow-100 text-yellow-700" };
    default: return { clase: "bg-slate-100 text-slate-600" };
  }
};

export const DocumentList = ({ documentos, documentoSeleccionadoId = null }: DocumentListProps) => {
  const [pdfSeleccionado, setPdfSeleccionado] = useState<string | null>(null);
  const [relacionesDocId, setRelacionesDocId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  useEffect(() => {
    if (!documentoSeleccionadoId) return;
    const elemento = document.getElementById(`documento-${documentoSeleccionadoId}`);
    elemento?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [documentoSeleccionadoId, documentos]);

  return (
    <>
      <div className="w-full">
        <p className="mb-3 text-sm text-slate-400">
          {documentos.length} documentos encontrados
        </p>
        <div className="space-y-3 pb-6">
          {documentos.map((doc) => {
            const estiloEstado = obtenerEstiloEstado(doc.estado);
            const seleccionado = documentoSeleccionadoId != null && String(doc.id) === String(documentoSeleccionadoId);

            return (
              <article
                id={`documento-${doc.id}`}
                key={doc.id}
                className={`rounded-xl border bg-white p-3 shadow-sm md:p-6 ${seleccionado ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start">
                  <h3 className="min-w-0 flex-1 wrap-break-word text-base font-semibold text-slate-900 md:text-lg">
                    {doc.titulo}
                  </h3>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${estiloEstado.clase}`}>
                    {doc.estado}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400 md:text-sm">
                  <span>{doc.tipo}</span><span>{doc.fecha}</span><span>{doc.organismo}</span>
                </div>
                <p className="mt-2 wrap-break-word text-sm text-slate-600">{doc.descripcion}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const documentId = String(doc.id).trim();
                      if (!documentId || ["NaN", "undefined", "null"].includes(documentId)) {
                        console.error("Identificador de documento inválido:", doc.id);
                        return;
                      }
                      setPdfSeleccionado(documentId);
                    }}
                    className="mt-3 w-full rounded-lg bg-sidebar py-2 text-sm text-white transition hover:opacity-90 md:w-auto md:px-4"
                  >
                    Ver documento
                  </button>

                  <button
                    type="button"
                    onClick={() => setRelacionesDocId(String(doc.id))}
                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-300 py-2 text-sm text-slate-700 transition hover:bg-slate-50 md:w-auto md:px-4"
                  >
                    <i className="pi pi-share-alt mr-2 text-sidebar" />
                    Ver relaciones
                  </button>

                  {user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => navigate(`/administracion?docId=${encodeURIComponent(String(doc.id))}`)}
                      className="mt-3 flex w-full items-center justify-center rounded-lg border border-amber-400 py-2 text-sm text-amber-500 transition hover:bg-amber-50 md:w-auto md:px-4"
                    >
                      <i className="pi pi-pencil mr-2" />Editar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {pdfSeleccionado !== null && (
        <PdfModal documentId={pdfSeleccionado} onClose={() => setPdfSeleccionado(null)} />
      )}
      {relacionesDocId !== null && (
        <RelacionesModal
          documentId={relacionesDocId}
          onClose={() => setRelacionesDocId(null)}
          onVerDocumento={(targetId) => {
            setRelacionesDocId(null);
            setPdfSeleccionado(targetId);
          }}
        />
      )}
    </>
  );
};
