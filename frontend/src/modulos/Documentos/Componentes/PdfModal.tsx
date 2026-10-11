import { useIsMobile } from "../../../Hooks/useIsMobile";
import { PdfMobile } from "./PdfMobile";
import { useDocumentUrl } from "../../../services/documentService";

type PdfModalProps = {
  documentId: number;
  onClose: () => void;
};

export const PdfModal = ({ documentId, onClose }: PdfModalProps) => {
  const isMobile = useIsMobile();
  const { data: url, isLoading, error } = useDocumentUrl(String(documentId));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-modal-title"
        className="flex h-[90%] w-full flex-col overflow-hidden rounded-xl bg-sidebar shadow-2xl sm:w-[90%]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 px-4 py-3 sm:px-5">
          <h2
            id="pdf-modal-title"
            className="font-semibold text-white"
          >
            Visualizador de documento
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visualizador"
            title="Cerrar"
            className="group flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:scale-95"
          >
            <i className="pi pi-times text-lg transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 bg-gray-200">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-sidebar" />
                <p className="text-slate-800">
                  Cargando documento...
                </p>
              </div>
            </div>
          ) : error || !url ? (
            <div className="flex h-full items-center justify-center p-4">
              <div className="rounded-lg bg-red-100 p-4 text-center">
                <p className="mb-2 font-semibold text-red-800">
                  Error al cargar el documento
                </p>
                <p className="text-sm text-red-700">
                  No se pudo obtener la URL de origen.
                </p>
              </div>
            </div>
          ) : isMobile ? (
            <PdfMobile archivo={url} />
          ) : (
            <iframe
              src={url}
              title="Documento PDF"
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};
