export const ChatInput = () => {
  return (
    <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-5 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Escribe tu consulta sobre reglamentos, normativas o resoluciones..."
            className="min-w-0 flex-1 rounded-2xl border border-gray-300 bg-white px-5 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-sky-900"
          />

          <button
            className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-900 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <i className="pi pi-send text-lg"></i>
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          La interpretación entregada por el sistema es de apoyo. La fuente
          oficial siempre corresponde al documento institucional vigente.
        </p>
      </div>
    </div>
  );
};