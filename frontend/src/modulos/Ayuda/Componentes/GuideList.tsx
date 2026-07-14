import { GuideStep } from "./GuideStep";

const steps = [
  {
    step: 1,
    icon: "pi pi-search",
    title: "Buscar un documento",
    description:
      "Utiliza el buscador para encontrar reglamentos, decretos, actas, convenios y otros documentos institucionales.",
    tips: [
      "Busca usando palabras clave.",
      "Puedes escribir el nombre del documento.",
      "No es necesario escribir el nombre completo.",
    ],
  },
  {
    step: 2,
    icon: "pi pi-filter",
    title: "Filtrar resultados",
    description:
      "Reduce los resultados utilizando filtros por tipo, estado, fecha u organismo.",
    tips: [
      "Puedes combinar varios filtros.",
      "Restablece los filtros cuando quieras.",
    ],
  },
  {
    step: 3,
    icon: "pi pi-eye",
    title: "Visualizar el documento",
    description:
      "Abre la vista previa para revisar el documento antes de descargarlo.",
    tips: [
      "Puedes navegar por todas las páginas.",
      "También puedes descargar el PDF.",
    ],
  },
  {
    step: 4,
    icon: "pi pi-comments",
    title: "Consultar con Don Fede",
    description:
      "Pregunta sobre reglamentos, artículos o procedimientos y obtén una respuesta basada en la documentación institucional.",
    tips: [
      "Haz preguntas claras.",
      "Revisa siempre la fuente oficial citada.",
    ],
  },
];

export const GuideList = () => {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Guía paso a paso
        </h2>

        <p className="text-gray-600">
          Sigue estos pasos para aprovechar todas las funciones de GIRU.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <GuideStep
            key={step.step}
            step={step.step}
            icon={step.icon}
            title={step.title}
            description={step.description}
            tips={step.tips}
          />
        ))}
      </div>
    </section>
  );
};