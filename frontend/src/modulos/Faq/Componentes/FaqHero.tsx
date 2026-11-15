import { useMemo, useState } from "react";

import { SearchBox } from "./SearchBox";
import { CategoryTabs } from "./CategoryTabs";
import { FaqList } from "./FaqList";
import { HelpCta } from "./HelpCta";
import { preguntas } from "./faqData";

const normalizarTexto = (texto: string) => {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const FaqHero = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    "Todas las categorías",
  );

  const preguntasFiltradas = useMemo(() => {
    const textoBuscado = normalizarTexto(busqueda.trim());

    return preguntas.filter((pregunta) => {
      const coincideCategoria =
        categoriaSeleccionada === "Todas las categorías" ||
        pregunta.category === categoriaSeleccionada;

      const contenido = normalizarTexto(
        `${pregunta.category} ${pregunta.question} ${pregunta.answer}`,
      );

      const coincideBusqueda =
        textoBuscado === "" ||
        contenido.includes(textoBuscado);

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaSeleccionada]);

  return (
    <div className="min-h-screen">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <div className="mb-6 flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-900 text-white sm:flex">
              <i className="pi pi-question-circle text-xl" />
            </div>

            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
                Preguntas frecuentes
              </h1>

              <p className="max-w-2xl leading-6 text-gray-600">
                Encuentra respuestas a las preguntas más comunes sobre
                reglamentos universitarios y el uso del sistema.
              </p>
            </div>
          </div>

          <SearchBox
            value={busqueda}
            onChange={setBusqueda}
          />
        </div>
      </section>

      <CategoryTabs
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaChange={setCategoriaSeleccionada}
      />

      <FaqList preguntas={preguntasFiltradas} />

      <HelpCta />
    </div>
  );
};