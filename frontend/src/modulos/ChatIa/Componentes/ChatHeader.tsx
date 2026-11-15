export const ChatHeader = () => {
  return (
    <header className="relative z-0 shrink-0 overflow-hidden border-b border-gray-200 bg-white px-4 py-2 sm:px-6 sm:py-3 lg:px-10">
      <div className="flex h-20 items-center gap-1 sm:h-24 sm:gap-2">
        <div className="relative flex h-20 w-24 shrink-0 items-center justify-center sm:h-24 sm:w-36">
          <img
            src="/assets/Don fede2.svg"
            alt="Don Fede"
            className="h-13.5 w-13.5 -translate-y-1 object-contain sm:h-19 sm:w-19"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            Don Fede
          </h1>

          <p className="mt-0.5 text-xs leading-4 text-gray-500 sm:text-sm sm:leading-normal">
            Asistente de Reglamentos, Normativas y Resoluciones UTFSM
          </p>
        </div>
      </div>
    </header>
  );
};
