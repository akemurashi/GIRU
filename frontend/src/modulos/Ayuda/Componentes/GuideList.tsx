import { GuideStep } from "./GuideStep";

const steps = [
  {
    step: 1,
    icon: "pi pi-home",
    title: "Explorar desde el Inicio",
    description:
      "Desde la página de Inicio, utiliza la barra de búsqueda central o selecciona una tarjeta de Acceso rápido por categoría (Reglamentos, Decretos) para explorar el catálogo institucional.",
    tips: [
      "Usa el menú lateral para cambiar rápidamente entre Inicio, Chat IA, Buscar documentos, Preguntas frecuentes y Ayuda.",
      "Las tarjetas de categoría abren directamente el buscador con el filtro de tipo de documento preseleccionado.",
    ],
  },
  {
    step: 2,
    icon: "pi pi-search",
    title: "Buscar un documento: Búsqueda híbrida y con #",
    description:
      "El buscador combina búsqueda inteligente (semántica y léxica) cuando escribes un tema o concepto y presionas Enter, y búsqueda léxica directa con autocompletado cuando antepones el símbolo #.",
    tips: [
      "Escribe conceptos o temas (ej. «rebaja académica», «convalidación») y presiona Enter para buscar en el contenido y títulos.",
      "Escribe # seguido de al menos 3 caracteres (ej. #reglamento, #053) para desplegar sugerencias instantáneas por Título o Metadato y saltar directo al documento.",
    ],
  },
  {
    step: 3,
    icon: "pi pi-filter",
    title: "Refinar resultados con filtros principales y avanzados",
    description:
      "En la vista de documentos, utiliza el panel lateral para acotar los resultados según criterios normativos y organizacionales.",
    tips: [
      "Filtra rápidamente por Tipo de documento, Estado (Vigente, Modificado, Derogado) y Año (con buscador numérico desde 1972).",
      "Haz clic en «Mostrar más filtros» para habilitar los filtros avanzados de selección múltiple: Área, Sede, Departamento y Carrera.",
      "Usa «Limpiar filtros» para restablecer la búsqueda en cualquier momento.",
    ],
  },
  {
    step: 4,
    icon: "pi pi-eye",
    title: "Visualizar y descargar el documento oficial",
    description:
      "En cada tarjeta de resultado, presiona «Ver documento» para abrir el visor de PDF integrado sin abandonar la plataforma.",
    tips: [
      "En computador puedes navegar por páginas, buscar texto dentro del PDF, imprimir o descargar el archivo original.",
      "En dispositivos móviles cuentas con controles dedicados de zoom (- y +) para facilitar la lectura.",
    ],
  },
  {
    step: 5,
    icon: "pi pi-share-alt",
    title: "Revisar las relaciones y trazabilidad normativa",
    description:
      "Presiona «Ver relaciones» en cualquier documento para abrir el panel lateral de Relaciones y Trazabilidad, que muestra su línea de tiempo normativa (Antes → Actual → Después).",
    tips: [
      "Revisa los Hitos Anteriores (antecedentes y normas de origen) y los Hitos Posteriores (reformas, modificaciones o derogaciones).",
      "Si el hito indica «Documento digitalizado», haz clic en «Ver documento» dentro de la línea de tiempo para abrir directamente ese decreto o reglamento.",
    ],
  },
  {
    step: 6,
    icon: "pi pi-comments",
    title: "Consultar con Don Fede, el asistente de IA",
    description:
      "Ingresa a Chat IA para hacer preguntas en lenguaje natural sobre reglamentos, artículos y trámites universitarios, obteniendo respuestas en tiempo real respaldadas por el corpus oficial.",
    tips: [
      "En pantallas grandes, aprovecha el panel derecho con Sugerencias de consulta y Documentos destacados para iniciar consultas frecuentes con un clic.",
      "Revisa siempre la tarjeta de Fuente oficial bajo la respuesta de Don Fede: verifica la Cita verificada (fragmento textual) y pulsa «Ver documento completo» o «Ver PDF» en las fuentes adicionales.",
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