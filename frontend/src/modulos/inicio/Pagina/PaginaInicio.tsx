import SidebarLayout from "../../Compartido/SidebarLayout";

import { SectionTituloYbusqueda } from "../Componentes/TituloYBusqueda";
import { QuickAccessSection } from "../Componentes/Cards";

export default function PaginaInicio() {
  return (
    <SidebarLayout>
      <SectionTituloYbusqueda />

      <QuickAccessSection />
    </SidebarLayout>
  );
}