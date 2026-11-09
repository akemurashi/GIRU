import { UseCaseCard } from "./UseCaseCard";

const useCases = [
  {
    title: "Duda urgente sobre carga académica, «candados» o Botón de Pánico (RAV)",
    situation:
      "Necesitas saber con urgencia cómo desinscribir una asignatura reprobada con candado (Art. 44 del Reglamento General N° 1), las restricciones de la Rebaja Académica Voluntaria (RAV) o cómo pedir rebaja de arancel por dedicación parcial (máx. 16 créditos SCT).",

    solution:
      "Entra a Chat IA (Don Fede) y selecciona una de las Sugerencias de consulta o Documentos destacados del panel lateral, o escribe tu caso directamente. Obtendrás la explicación inmediata junto con la Cita verificada y el botón «Ver documento completo» para revisar el reglamento oficial.",
  },

  {
    title: "Búsqueda rápida de un decreto o reglamento por su número o nombre exacto",
    situation:
      "Conoces el número de un decreto o parte del nombre oficial de una normativa (por ejemplo, el Reglamento N° 1 o un número de decreto específico) y quieres abrir su PDF sin recorrer páginas de resultados.",

    solution:
      "En el buscador de Inicio o de Buscar documentos, escribe # seguido de al menos 3 caracteres del título o código (ej. #reglamento). Selecciona la coincidencia por Título o Metadato en el desplegable y haz clic en «Ver documento».",
  },

  {
    title: "Verificación de vigencia e historial de modificaciones de una normativa",
    situation:
      "Tienes un reglamento o decreto de años anteriores y necesitas confirmar si sigue vigente o si fue reformado o derogado por una resolución más reciente.",

    solution:
      "Busca el documento y haz clic en «Ver relaciones». En el panel de Relaciones y Trazabilidad, revisa la línea de tiempo (Hitos Anteriores → Documento actual → Hitos Posteriores) y pulsa «Ver documento» en los hitos posteriores digitalizados para consultar las reformas vigentes.",
  },

  {
    title: "Exploración de normativas aplicables a una sede, departamento o carrera específica",
    situation:
      "Necesitas recopilar únicamente los reglamentos o decretos vigentes que aplican a tu Campus/Sede, Departamento o Carrera dentro de un período determinado.",

    solution:
      "En Buscar documentos, selecciona el Tipo de documento, el Estado (Vigente) y el Año. Luego pulsa «Mostrar más filtros» para filtrar por Área, Sede, Departamento o Carrera, combinando múltiples criterios según tu necesidad.",
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