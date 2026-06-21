import { SidebarNavItems } from "../Compartido/SidebarNavItem";


export const SidebarNav = () => {

  return (

    <nav className="flex-1 p-4">

      <ul className="list-none p-0">
      <SidebarNavItems
          href="/login"
          icon="pi-user"
          label="Inicio de sesión"
        />


        <SidebarNavItems
          href="/"
          icon="pi-home"
          label="Inicio"
        />


        <SidebarNavItems
          href="/chat"
          icon="pi-comments"
          label="Chat IA"
        />


        <SidebarNavItems
          href="/documentos"
          icon="pi-search"
          label="Buscar documentos"
        />


        <SidebarNavItems
          href="/faq"
          icon="pi-question-circle"
          label="FAQ"
        />


        <SidebarNavItems
          href="/ayuda"
          icon="pi-info-circle"
          label="Ayuda y uso del sistema"
        />


      </ul>

    </nav>

  );
};