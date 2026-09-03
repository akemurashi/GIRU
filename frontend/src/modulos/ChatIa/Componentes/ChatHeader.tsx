export const ChatHeader = () => {
  return (
    <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-900 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
          <i className="pi pi-book text-xl text-white sm:text-2xl"></i>
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Don Fede
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            Asistente de Reglamentos, Normativas y Resoluciones UTFSM
          </p>
        </div>
      </div>
    </header>
  );
};