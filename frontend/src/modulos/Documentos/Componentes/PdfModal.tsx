type PdfModalProps = {
  archivo: string;
  onClose: () => void;
};

export const PdfModal = ({
  archivo,
  onClose,
}: PdfModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">

      <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">
            Visualizador de documento
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <iframe
          src={archivo}
          className="w-full h-full"
        />

      </div>

    </div>
  );
};