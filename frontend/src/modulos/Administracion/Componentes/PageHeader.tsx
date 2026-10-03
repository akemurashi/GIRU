export const PageHeader = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 sm:px-8">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#003d7a] text-white shadow-sm">
          <i className="pi pi-cog text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Panel de Administración
          </h1>
          <p className="m-0 mt-1 text-sm text-slate-500 sm:text-base">
            Búsqueda, selección y edición de documentos reglamentarios
          </p>
        </div>
      </div>
    </header>
  );
};
