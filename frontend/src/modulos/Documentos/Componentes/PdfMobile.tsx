import { useState } from "react";
import { Document, Page } from "react-pdf";
import "./pdfConfig";

type Props = {
  archivo: string;
};

export function PdfMobile({ archivo }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  const width = window.innerWidth * 0.95 * scale;

  return (
    <div className="h-full overflow-y-auto bg-gray-100">

      {/* CONTROLES ZOOM */}
      <div className="sticky top-0 z-10 flex justify-center gap-3 bg-white p-2 shadow">
        <button
          onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
          className="rounded bg-gray-200 px-3 py-1"
        >
          -
        </button>

        <span className="text-sm">{Math.round(scale * 100)}%</span>

        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="rounded bg-gray-200 px-3 py-1"
        >
          +
        </button>
      </div>

      {/* PDF */}
      <div className="flex justify-center py-3">
        <Document
          file={archivo}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="mb-4 bg-white shadow">
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