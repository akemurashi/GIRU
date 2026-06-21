import Sidebar from "../../Compartido/Sidebar";

import { SectionTituloYbusqueda } from "../Componentes/TituloYBusqueda";
import { QuickAccessSection } from "../Componentes/Cards";


export default function PaginaInicio() {

  return (

    <div
      className="
        flex
        min-h-screen
        flex-col
        md:flex-row
      "
    >

      {/* Barra lateral reutilizable */}
      <Sidebar />


      {/* Componentes propios de Inicio */}
      <main
        className="
          flex-1
          md:ml-64
        "
      >

        <SectionTituloYbusqueda />

        <QuickAccessSection />

      </main>


    </div>

  );
}