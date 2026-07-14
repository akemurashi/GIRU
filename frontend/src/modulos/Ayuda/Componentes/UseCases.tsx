import { UseCaseCard } from "./UseCaseCard";

const useCases = [
  {
    title: "Consulta académica urgente",
    situation:
      "Necesitas saber rápidamente si puedes anular una asignatura.",

    solution:
      "Consulta a Don Fede con una pregunta como «¿Hasta cuándo puedo anular una asignatura?» para obtener la respuesta junto con la referencia oficial correspondiente.",
  },

  {
    title: "Investigación de normativa",
    situation:
      "Necesitas revisar varios reglamentos relacionados con un mismo tema.",

    solution:
      "Utiliza la búsqueda avanzada y los filtros. Luego revisa las relaciones entre documentos para encontrar toda la normativa aplicable.",
  },

  {
    title: "Verificación de vigencia",
    situation:
      "Tienes un reglamento antiguo y necesitas confirmar si sigue vigente.",

    solution:
      "Busca el documento por nombre o palabras clave. El sistema mostrará si está vigente, modificado o reemplazado, junto con la normativa correspondiente.",
  },
];

export const UseCases = () => {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Escenarios comunes de uso
          </h2>

          <p className="mt-2 text-slate-600">
            Algunos ejemplos de cómo aprovechar GIRU en situaciones frecuentes.
          </p>
        </div>

        <div className="space-y-6">
          {useCases.map((useCase) => (
            <UseCaseCard
              key={useCase.title}
              title={useCase.title}
              situation={useCase.situation}
              solution={useCase.solution}
            />
          ))}
        </div>
      </div>
    </section>
  );
};