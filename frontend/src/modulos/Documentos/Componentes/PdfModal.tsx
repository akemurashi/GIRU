import { useIsMobile } from "../../../Hooks/useIsMobile";
import { PdfMobile } from "./PdfMobile";
import { useDocumentUrl } from "../../../services/documentService";

type PdfModalProps = {
  documentId: number;
  onClose: () => void;
};

export const PdfModal = ({ documentId, onClose }: PdfModalProps) => {
  const isMobile = useIsMobile();
  const { data: url, isLoading, error } = useDocumentUrl(documentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="flex h-[90%] w-[90%] flex-col overflow-hidden rounded-xl bg-sidebar">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold text-white">
            Visualizador de documento
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-white"
          >
            X
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-200">

          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sidebar inline-block"></div>
                <p className="text-slate-800">Cargando documento...</p>
              </div>
            </div>
          ) : error || !url ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center bg-red-100 p-4 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">Error al cargar el documento</p>
                <p className="text-red-700 text-sm">No se pudo obtener la URL de origen.</p>
              </div>
            </div>
          ) : isMobile ? (
            <PdfMobile archivo={url} />
          ) : (
            <iframe
              src={url}
              className="h-full w-full"
            />
          )}

        </div>

      </div>
    </div>
  );
};
