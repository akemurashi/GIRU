import { PracticeCard } from "./PracticeCard";

const practices = [
  {
    icon: "pi pi-check-circle",
    title: "Verificar siempre el estado del documento",
    description:
      "Asegúrate de que el documento esté vigente. Los documentos derogados o reemplazados se mantienen únicamente como referencia histórica.",
  },

  {
    icon: "pi pi-book",
    title: "Revisar el artículo citado",
    description:
      "Lee siempre el artículo completo del documento oficial para comprender el contexto y evitar interpretaciones incompletas.",
  },

  {
    icon: "pi pi-history",
    title: "Confirmar la versión vigente",
    description:
      "Antes de tomar una decisión, verifica que estás consultando la versión más reciente del reglamento o normativa.",
  },

  {
    icon: "pi pi-comments",
    title: "Usar Don Fede como apoyo",
    description:
      "Las respuestas ayudan a comprender la normativa, pero la fuente oficial siempre será el documento institucional vigente.",
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