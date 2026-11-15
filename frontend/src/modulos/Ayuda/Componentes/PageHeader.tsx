export const PageHeader = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-900 text-white">
              <i className="pi pi-info-circle text-2xl" />
            </div>

            <div>
              <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                Cómo usar la plataforma
              </h1>

              <p className="max-w-3xl text-base leading-7 text-gray-600 md:text-xl">
                Aprende a utilizar eficazmente el Sistema de Gestión y Consulta
                de Reglamentos UTFSM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};