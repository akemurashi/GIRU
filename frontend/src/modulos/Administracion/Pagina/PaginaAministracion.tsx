import SidebarLayout from "../../Compartido/SidebarLayout";
import { PageHeader } from "../Componentes/PageHeader";
import { DocumentSearch } from "../Componentes/DocumentSearch";

export default function PaginaAdministracion() {
    return (
        <SidebarLayout>
        <PageHeader />
        <DocumentSearch />

        </SidebarLayout>
    );
}