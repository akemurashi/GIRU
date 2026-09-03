
import * as SearchModule from "../../Compartido/Busqueda";

export const SectionTituloYbusqueda = () => {
  const SearchBoxComponent =
    (SearchModule as any).SearchBox ??
    (SearchModule as any).default ??
    null;

  return (
    <section className="bg-white border-b border-black/10">
      <div className="max-w-5xl mx-auto px-8 py-8 md:px-8 md:py-16">
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
          Gestion Inteligente de Reglamentos Universitarios
        </h1>

        <p className="text-base md:text-xl text-slate-600 max-w-3xl mb-6 md:mb-8">
          Encuentra la normativa aplicable, verifica su vigencia y comprende su
          significado de manera rápida y precisa.
        </p>

        {typeof SearchBoxComponent === "function" ? (
          <SearchBoxComponent />
        ) : null}
      </div>
    </section>
  );
};