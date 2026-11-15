import { useEffect, useState } from "react";

import { FaqItem } from "./FaqItem";
import type { Faq } from "./faqData";

export type FaqListProps = {
  preguntas: Faq[];
};

export const FaqList = ({
  preguntas,
}: FaqListProps) => {
  const [preguntaAbierta, setPreguntaAbierta] =
    useState<number | null>(null);

  useEffect(() => {
    if (
      preguntaAbierta !== null &&
      !preguntas.some((pregunta) => pregunta.id === preguntaAbierta)
    ) {
      setPreguntaAbierta(null);
    }
  }, [preguntas, preguntaAbierta]);

  const cambiarPregunta = (id: number) => {
    setPreguntaAbierta((actual) =>
      actual === id ? null : id,
    );
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
      {preguntas.length > 0 ? (
        <div className="space-y-3">
          {preguntas.map((pregunta) => (
            <FaqItem
              key={pregunta.id}
              category={pregunta.category}
              question={pregunta.question}
              answer={pregunta.answer}
              isOpen={preguntaAbierta === pregunta.id}
              onToggle={() => cambiarPregunta(pregunta.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <i className="pi pi-search text-xl text-gray-500" />
          </div>

          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            No encontramos resultados
          </h2>

          <p className="text-sm text-gray-500">
            Prueba con otra palabra o selecciona una categoría diferente.
          </p>
        </div>
      )}
    </section>
  );
};