export const ChatInput = () => {
  return (
    <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Escribe tu consulta sobre reglamentos, normativas o resoluciones..."
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-sky-900 sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm"
          />

          <button
            className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-900 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-14 sm:rounded-2xl"
            disabled
          >
            <i className="pi pi-send text-base sm:text-lg"></i>
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] leading-4 text-gray-500 sm:mt-3 sm:text-xs sm:leading-normal">
          La interpretación entregada por el sistema es de apoyo. La fuente
          oficial siempre corresponde al documento institucional vigente.
        </p>
      </div>
    </div>
  );
};