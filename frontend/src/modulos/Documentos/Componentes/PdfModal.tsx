import { useState } from "react";
import { useIsMobile } from "../../../Hooks/useIsMobile";
import { PdfMobile } from "./PdfMobile";
import { useDocumentUrl } from "../../../services/documentService";

type PdfModalProps = Readonly<{
  documentId: string;
  onClose: () => void;
}>;

type PdfDesktopViewerProps = Readonly<{
  url: string;
}>;

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
        <source src="/giruLupa.webm" type="video/webm" />
        <source src="/videos/giru-loading.mp4" type="video/mp4" />
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

export const PdfModal = ({ documentId, onClose }: PdfModalProps) => {
  const isMobile = useIsMobile();

  const { data: url, isLoading, error } = useDocumentUrl(documentId);

  let viewerContent: React.ReactNode;
  if (isLoading) {
    viewerContent = (
      <div className="relative h-full w-full">
        <PdfLoadingPlayer />
      </div>
    );
  } else if (error || !url) {
    viewerContent = (
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
    );
  } else if (isMobile) {
    viewerContent = <PdfMobile archivo={url} />;
  } else {
    viewerContent = <PdfDesktopViewer url={url} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6">
      <button
        type="button"
        aria-label="Cerrar visualizador de fondo"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default border-0 bg-black/60 backdrop-blur-sm"
      />

      <dialog
        open
        aria-modal="true"
        aria-labelledby="pdf-modal-title"
        className="relative z-10 m-0 flex h-[94dvh] w-full flex-col overflow-hidden rounded-xl border-0 bg-sidebar p-0 text-left shadow-2xl sm:h-[92dvh] sm:w-[95%] md:h-[90dvh] md:w-[92%] lg:w-[88%] xl:w-[85%] 2xl:max-w-7xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5">
          <h2
            id="pdf-modal-title"
            className="truncate text-sm font-semibold text-white sm:text-base md:text-lg"
          >
            Visualizador de documento
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visualizador"
            title="Cerrar"
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:scale-95"
          >
            <i className="pi pi-times text-lg transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 bg-gray-200">{viewerContent}</div>
      </dialog>
    </div>
  );
};
