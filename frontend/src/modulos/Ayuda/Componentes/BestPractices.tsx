import { PracticeCard } from "./PracticeCard";

const practices = [
  {
    icon: "pi pi-check-circle",
    title: "Verificar la insignia de estado y la trazabilidad",
    description:
      "Comprueba siempre la etiqueta de estado en cada documento (Vigente en verde, Modificado en amarillo o Derogado en rojo) y abre «Ver relaciones» para confirmar si existen decretos posteriores que lo modifiquen.",
  },

  {
    icon: "pi pi-hashtag",
    title: "Usar # para búsquedas exactas y texto libre para temas",
    description:
      "Si conoces el número de decreto, código o título del reglamento, antepón # (más al menos 3 caracteres) para usar el autocompletado léxico directo; si buscas por situación o concepto, escribe sin # para activar la búsqueda híbrida con IA.",
  },

  {
    icon: "pi pi-book",
    title: "Validar la «Cita verificada» y abrir el PDF oficial",
    description:
      "Cuando consultes a Don Fede, revisa el fragmento textual en el recuadro de Fuente oficial (Cita verificada) y utiliza el botón «Ver documento completo» para leer el artículo íntegro en su contexto original.",
  },

  {
    icon: "pi pi-comments",
    title: "Usar a Don Fede como apoyo orientativo",
    description:
      "Las interpretaciones de Don Fede facilitan la comprensión de trámites y reglamentos, pero para solicitudes formales o resoluciones académicas la fuente vinculante siempre es el documento institucional vigente.",
  },
];

export const BestPractices = () => {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Buenas prácticas de consulta
          </h2>

          <p className="mt-2 text-slate-600">
            Sigue estas recomendaciones para aprovechar al máximo la plataforma
            y obtener información confiable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {practices.map((practice) => (
            <PracticeCard
              key={practice.title}
              icon={practice.icon}
              title={practice.title}
              description={practice.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};