export const ChatHeader = () => {
  return (
    <header className="relative z-0 shrink-0 overflow-hidden border-b border-gray-200 bg-white px-4 py-2 sm:px-6 sm:py-3 lg:px-10">
      <div className="flex h-16 items-center gap-3 sm:h-20 sm:gap-4">
        <div className="relative flex h-16 w-20 shrink-0 items-center justify-center sm:h-20 sm:w-28">
          <img
            src="/assets/Don fede.svg"
            alt="Don Fede"
            className="h-20 w-20 object-contain sm:h-32 sm:w-32"
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