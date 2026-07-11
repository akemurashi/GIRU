import { useIsMobile } from "../../../Hooks/useIsMobile";
import { PdfMobile } from "./PdfMobile";

type PdfModalProps = {
  archivo: string;
  onClose: () => void;
};

export const PdfModal = ({ archivo, onClose }: PdfModalProps) => {
  const isMobile = useIsMobile();

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
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-200">

          {isMobile ? (
            <PdfMobile archivo={archivo} />
          ) : (
            <iframe
              src={archivo}
              className="h-full w-full"
            />
          )}

        </div>

      </div>
    </div>
  );
};