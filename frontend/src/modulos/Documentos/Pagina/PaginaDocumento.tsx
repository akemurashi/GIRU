import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../../Compartido/Sidebar";
import { SearchBox } from "../../Compartido/Busqueda";
import { FilterSidebar } from "../Componentes/FilterSidebar";
import { DocumentList } from "../Componentes/DocumentList";
import { documentos } from "../Componentes/DocumentosParaVer";

export default function PaginaDocumentos() {
  const [searchParams] = useSearchParams();

  const tipoUrl = searchParams.get("tipo") || "Todos";

  const [tipoSeleccionado, setTipoSeleccionado] = useState(tipoUrl);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    setTipoSeleccionado(tipoUrl);
  }, [tipoUrl]);

  const documentosFiltrados =
    tipoSeleccionado === "Todos"
      ? documentos
      : documentos.filter((doc) => doc.tipo === tipoSeleccionado);

  return (
    <div className="h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="h-screen lg:pl-64 overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row">
          <aside className="hidden lg:block border-r border-slate-200">
            <FilterSidebar
              tipoSeleccionado={tipoSeleccionado}
              onTipoChange={setTipoSeleccionado}
            />
          </aside>

          <section
            className="
                flex
                flex-1
                min-w-0
                flex-col
                overflow-hidden
                "
          >
            <header
              className="
                border-b
                border-slate-200
                bg-white
                px-3
                py-3
                md:p-6
                "
            >
              <h1
                className="
                mb-3
                text-xl
                font-bold
                text-slate-900
                md:text-3xl
"
              >
                Buscar documentos
              </h1>

              <SearchBox />

              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="
                    mt-3
                    w-full
                    rounded-lg
                    border
                    bg-sidebar
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-slate-900
                    transition
                    lg:hidden
      "
              >
                {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
              </button>

              {mostrarFiltros && (
                <div
                  className="
                    mt-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    "
                >
                  <FilterSidebar
                    tipoSeleccionado={tipoSeleccionado}
                    onTipoChange={setTipoSeleccionado}
                  />
                </div>
              )}
            </header>

            <div
              className="
                flex-1
                overflow-y-auto
                overflow-x-hidden
                px-3
                py-3
                pb-8
                md:p-6
"
            >
              <DocumentList documentos={documentosFiltrados} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
