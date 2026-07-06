export const ChatHeader = () => {
  return (
    <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-6 lg:px-10">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-900 shadow-sm">
          <i className="pi pi-book text-2xl text-white"></i>
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Don Fede</h1>

          <p className="mt-1 text-sm text-gray-500">
            Asistente de Reglamentos, Normativas y Resoluciones UTFSM
          </p>
        </div>
      </div>
    </header>
  );
};