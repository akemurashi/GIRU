
import { useState } from "react";
import { useIsMobile } from "../../../Hooks/useIsMobile";
import { PdfMobile } from "./PdfMobile";
import { useDocumentUrl } from "../../../services/documentService";

type PdfModalProps = {
  documentId: string;
  onClose: () => void;
};

type PdfDesktopViewerProps = {
  url: string;
};

const PdfLoadingPlayer = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-gray-200">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Animación de carga del documento"
        className="h-56 w-56 object-contain drop-shadow-[0_0_3px_rgba(0,61,122,0.65)] sm:h-72 sm:w-72"
      >
        <source
          src="/giruLupa.webm"
          type="video/webm"
        />
        <source
          src="/videos/giru-loading.mp4"
          type="video/mp4"
        />
      </video>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <i className="pi pi-spin pi-spinner text-[#1769AA]" />
        <span>Cargando documento...</span>
      </div>
    </div>
  );
};

const PdfDesktopViewer = ({ url }: PdfDesktopViewerProps) => {
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-200">
      <iframe
        key={url}
        src={url}
        title="Documento PDF"
        onLoad={() => setIsPdfLoading(false)}
        className="h-full w-full border-0"
      />

      {isPdfLoading && <PdfLoadingPlayer />}
    </div>
  );
};

export const PdfModal = ({
  documentId,
  onClose,
}: PdfModalProps) => {
  const isMobile = useIsMobile();

  const {
    data: url,
    isLoading,
    error,
  } = useDocumentUrl(documentId);

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
            <div className="relative h-full w-full">
              <PdfLoadingPlayer />
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
            <PdfDesktopViewer url={url} />
          )}
        </div>
      </div>
    </div>
  );
};
