import { useIsMobile } from "../../../Hooks/useIsMobile";

type PdfModalProps = {
  archivo: string;
  onClose: () => void;
};

export const PdfModal = ({ archivo, onClose }: PdfModalProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-sidebar md:h-[90%] md:w-[90%]">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/20 p-4">
          <h2 className="font-semibold text-white">
            Visualizador de documento
          </h2>

          <button onClick={onClose} className="text-xl text-white">
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-gray-200">
          {isMobile ? (
            <iframe
              src={archivo}
              title="Visualizador PDF móvil"
              className="h-full w-full border-0"
            />
          ) : (
            <iframe
              src={archivo}
              title="Visualizador PDF escritorio"
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};