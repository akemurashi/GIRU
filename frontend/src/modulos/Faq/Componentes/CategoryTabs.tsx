import { categorias } from "./faqData";

export type CategoryTabsProps = {
  categoriaSeleccionada: string;
  onCategoriaChange: (categoria: string) => void;
};

export const CategoryTabs = ({
  categoriaSeleccionada,
  onCategoriaChange,
}: CategoryTabsProps) => {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 md:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categorias.map((categoria) => {
            const activa = categoriaSeleccionada === categoria;

            return (
              <button
                key={categoria}
                type="button"
                onClick={() => onCategoriaChange(categoria)}
                className={`
                  shrink-0
                  whitespace-nowrap
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    activa
                      ? "bg-sky-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {categoria}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};