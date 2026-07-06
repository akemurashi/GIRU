export const FeaturedDocuments = () => {
  const documentos = [
    {
      titulo: "Reglamento del Estudiante",
      tipo: "Reglamento",
      icono: "pi pi-book",
    },
    {
      titulo: "Normativa de Evaluación",
      tipo: "Normativa",
      icono: "pi pi-clipboard",
    },
    {
      titulo: "Reglamento Disciplinario",
      tipo: "Reglamento",
      icono: "pi pi-file",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Documentos destacados
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Acceso rápido a documentos institucionales.
        </p>
      </div>

      <div className="space-y-3">
        {documentos.map((documento) => (
          <button
            key={documento.titulo}
            className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-sky-900 hover:bg-sky-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-900">
              <i className={`${documento.icono} text-lg`}></i>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {documento.titulo}
              </p>

              <p className="text-xs text-gray-500">{documento.tipo}</p>
            </div>

            <i className="pi pi-angle-right text-gray-400 group-hover:text-sky-900"></i>
          </button>
        ))}
      </div>
    </section>
  );
};