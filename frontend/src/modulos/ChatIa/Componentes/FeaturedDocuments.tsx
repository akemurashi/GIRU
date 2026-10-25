interface FeaturedDocumentsProps {
  onSelectDocument: (consulta: string) => void;
  disabled?: boolean;
}

export const FeaturedDocuments = ({
  onSelectDocument,
  disabled = false,
}: FeaturedDocumentsProps) => {
  const documentos = [
    {
      titulo: "Reglamento General N° 1 (Art. 44)",
      tipo: "Inscripción y desinscripción de ramos con candado",
      icono: "pi pi-book",
      consulta:
        "¿Qué establece el Reglamento General N° 1 y el Artículo 44 sobre las asignaturas reprobadas con candado y su desinscripción?",
    },
    {
      titulo: "Rebaja Académica Voluntaria (RAV)",
      tipo: "Normativa sobre uso del botón de pánico",
      icono: "pi pi-exclamation-circle",
      consulta:
        "¿Cuáles son las condiciones y restricciones de la Rebaja Académica Voluntaria (RAV) o botón de pánico?",
    },
    {
      titulo: "Convalidación de Asignaturas",
      tipo: "Equivalencias y reconocimiento de ramos",
      icono: "pi pi-sync",
      consulta:
        "¿Cuál es el procedimiento para convalidar asignaturas en la USM o reconocer ramos cursados en otra carrera o institución?",
    },
    {
      titulo: "Baja Carga y Dedicación Parcial",
      tipo: "Rebaja de arancel (máx. 16 créditos SCT)",
      icono: "pi pi-percentage",
      consulta:
        "¿Cuáles son los requisitos de créditos SCT y reglamentación para solicitar calidad de alumno regular de dedicación parcial y rebaja de arancel?",
    },
    {
      titulo: "Matrícula y Retiro Temporal",
      tipo: "Validación, matrícula sin ramos y congelamiento",
      icono: "pi pi-calendar-times",
      consulta:
        "¿Cómo funcionan los procesos de validación de matrícula, matrícula sin ramos, retiro temporal y reincorporación?",
    },
    {
      titulo: "Proceso de Titulación y Certificados",
      tipo: "Memoristas, grado de licenciado y certificados",
      icono: "pi pi-verified",
      consulta:
        "¿Cómo es el proceso de titulación, extensión de proyecto de título y solicitud de certificados oficiales en la USM?",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Documentos destacados
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Acceso rápido a consultas sobre normativas y procesos clave.
        </p>
      </div>

      <div className="space-y-3">
        {documentos.map((documento) => (
          <button
            key={documento.titulo}
            type="button"
            disabled={disabled}
            onClick={() => onSelectDocument(documento.consulta)}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-sky-900 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-900">
              <i className={`${documento.icono} text-lg`}></i>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {documento.titulo}
              </p>

              <p className="truncate text-xs text-gray-500">{documento.tipo}</p>
            </div>

            <i className="pi pi-angle-right text-gray-400 group-hover:text-sky-900"></i>
          </button>
        ))}
      </div>
    </section>
  );
};