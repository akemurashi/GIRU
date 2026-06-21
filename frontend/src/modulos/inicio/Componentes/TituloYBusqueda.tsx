import { SearchBox } from "../../Compartido/Busqueda";

export const SectionTituloYbusqueda = () => {
  return (
    <section className="bg-white border-b border-black/10">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Gestion Inteligente de Reglamentos Universitarios
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mb-8">
          Encuentra la normativa aplicable, verifica su vigencia y comprende su
          significado de manera rápida y precisa.
        </p>

        <SearchBox />
      </div>
    </section>
  );
};