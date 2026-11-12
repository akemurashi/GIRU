import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "./pdfConfig";

type Props = Readonly<{
  archivo: string;
}>;

/**
 * Calcula el ancho base ideal de la página PDF según los puntos de quiebre
 * del contenedor (móvil, phablet, tablet vertical como Tab S7 FE 800px, tablet horizontal 1280px).
 */
function calcularAnchoBase(containerWidth: number): number {
  if (containerWidth <= 0) {
    return Math.min(window.innerWidth * 0.92, 820);
  }
  if (containerWidth < 480) {
    return containerWidth - 16;
  }
  if (containerWidth < 640) {
    return containerWidth - 24;
  }
  if (containerWidth < 768) {
    return Math.min(containerWidth - 32, 680);
  }
  if (containerWidth < 1024) {
    // Tablets en vertical (ej. Galaxy Tab S7 FE: ~800px)
    return Math.min(containerWidth - 40, 760);
  }
  // Tablets en horizontal (ej. Galaxy Tab S7 FE: ~1280px) y pantallas grandes
  return Math.min(containerWidth - 56, 920);
}

export function PdfMobile({ archivo }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(el);

    window.addEventListener("orientationchange", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateWidth);
    };
  }, []);

  const baseWidth = calcularAnchoBase(containerWidth);
  const width = Math.round(baseWidth * scale);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col overflow-hidden bg-gray-100"
    >
      {/* CONTROLES ZOOM */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-center gap-2 border-b border-slate-200 bg-white px-3 py-2 shadow-xs sm:gap-3 md:py-2.5">
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2)))}
          aria-label="Alejar documento"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 sm:h-9 sm:w-9"
        >
          -
        </button>

        <button
          type="button"
          onClick={() => setScale(1)}
          title="Restablecer zoom"
          className="min-w-14 rounded-md px-2 py-1 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:text-sm"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          type="button"
          onClick={() => setScale((s) => Math.min(2.2, +(s + 0.1).toFixed(2)))}
          aria-label="Acercar documento"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 sm:h-9 sm:w-9"
        >
          +
        </button>

        {numPages > 0 && (
          <span className="ml-1 border-l border-slate-200 pl-2 text-xs text-slate-500 sm:ml-2 sm:pl-3 sm:text-sm">
            {numPages} {numPages === 1 ? "pág." : "págs."}
          </span>
        )}
      </div>

      {/* PDF */}
      <div className="min-h-0 flex-1 overflow-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6">
        <Document
          file={archivo}
          onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
          loading={
            <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-600">
              <i className="pi pi-spin pi-spinner mb-2 text-2xl text-[#1769AA]" />
              <span>Cargando documento...</span>
            </div>
          }
          error={
            <div className="mx-auto max-w-md rounded-lg bg-red-100 p-4 text-center">
              <p className="mb-1 font-semibold text-red-800">
                No se pudo visualizar el PDF
              </p>
              <p className="text-xs text-red-700 sm:text-sm">
                Intenta nuevamente o verifica tu conexión.
              </p>
            </div>
          }
          className="flex flex-col items-center"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              className="mb-3 max-w-full overflow-x-auto rounded-sm bg-white shadow-md sm:mb-4"
            >
              <Page
                pageNumber={i + 1}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
