import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../../Compartido/Sidebar";

import { SearchBox } from "../../Compartido/Busqueda";
import { FilterSidebar } from "../Componentes/FilterSidebar";
import { DocumentList } from "../Componentes/DocumentList";

import { documentos } from "../Componentes/DocumentosParaVer";

export default function PaginaDocumentos() {

  const [searchParams] = useSearchParams();

  const tipoUrl =
    searchParams.get("tipo") || "Todos";

  const [tipoSeleccionado, setTipoSeleccionado] =
    useState(tipoUrl);

  useEffect(() => {
    setTipoSeleccionado(tipoUrl);
  }, [tipoUrl]);

  const documentosFiltrados =
    tipoSeleccionado === "Todos"
      ? documentos
      : documentos.filter(
          (doc) =>
            doc.tipo === tipoSeleccionado
        );

  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        md:flex-row
      "
    >
      <Sidebar />

      <main
        className="
          flex-1
          md:ml-64
        "
      >
        <div className="flex h-full">

          <FilterSidebar
            tipoSeleccionado={tipoSeleccionado}
            onTipoChange={setTipoSeleccionado}
          />

          <section className="flex-1">

            <div className="border-b bg-white p-8">

              <h1 className="text-3xl font-bold mb-4">
                Buscar documentos
              </h1>

              <SearchBox />

            </div>

            <DocumentList
              documentos={documentosFiltrados}
            />

          </section>

        </div>
      </main>

    </div>
  );
}