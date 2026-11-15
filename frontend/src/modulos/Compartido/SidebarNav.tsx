import { useEffect, useState } from "react";
import { SidebarNavItems } from "./SidebarNavItem";
import { authService } from "../../services/authService";

export const SidebarNav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <nav className="flex-1 p-4">
      <ul className="list-none p-0">
        {!isAuthenticated && (
          <SidebarNavItems
            href="/login"
            icon="pi-user"
            label="Inicio de sesión"
          />
        )}

        <SidebarNavItems
          href="/"
          icon="pi-home"
          label="Inicio"
        />

        <SidebarNavItems
          href="/chat-ia"
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
          label="Preguntas frecuentes"
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