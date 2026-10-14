import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/Pagina/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";
import PaginaChatIa from "../modulos/ChatIa/Pagina/PaginaChatIa";
import PaginaFaq from "../modulos/Faq/Pagina/PaginaFaq";
import PaginaAyuda from "../modulos/Ayuda/Pagina/PaginaAyuda";
import PaginaLogin from "../modulos/Auth/Pagina/PaginaLogin";
import PaginaCallback from "../modulos/Auth/Pagina/PaginaCallback";
import PaginaAdministracion from "../modulos/Administracion/Pagina/PaginaAministracion";
import PaginaChatIaTest from "../modulos/ChatIa/Componentes/DonFedeTest";
import { authService } from "../services/authService";

const APP_ORIGIN = window.location.origin; // http://localhost:5173

// Paso 1: Cognito cierra su sesión y vuelve a /logout-microsoft.
// Esta URL debe estar registrada EXACTA en "Allowed sign-out URLs".
const COGNITO_LOGOUT_URL =
  "https://giru-dev-auth.auth.us-east-1.amazoncognito.com/logout" +
  "?client_id=7iqv62une6ne7mgoicv673j896" +
  `&logout_uri=${encodeURIComponent(`${APP_ORIGIN}/logout-microsoft`)}`;

// Paso 2: Microsoft cierra su sesión y vuelve a /login.
// Esta URL debe estar registrada en Entra ID (Web → Redirect URIs).
const MICROSOFT_LOGOUT_URL =
  `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}/oauth2/v2.0/logout` +
  `?client_id=${import.meta.env.VITE_AZURE_CLIENT_ID}` +
  `&post_logout_redirect_uri=${encodeURIComponent(`${APP_ORIGIN}/login`)}`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
  },
  {
    path: "/documentos",
    element: <Documentos />,
  },
  {
    path: "/chat-ia",
    element: <PaginaChatIa />,
  },
  {
    path: "/faq",
    element: <PaginaFaq />,
  },
  {
    path: "/ayuda",
    element: <PaginaAyuda />,
  },
  {
    path: "/login",
    element: <PaginaLogin />,
  },
  {
    path: "/callback",
    element: <PaginaCallback />,
  },
  {
    path: "/administracion",
    element: <PaginaAdministracion />,
  },
  {
    path: "/chat-ia-test",
    element: <PaginaChatIaTest />,
  },
  {
    path: "/logout",
    loader: () => {
      authService.logout(); // borra auth_token y auth_user
      localStorage.setItem("force_login", "1"); // refuerzo: prompt=login en el próximo acceso
      window.location.replace(COGNITO_LOGOUT_URL);
      return null;
    },
  },
  {
    path: "/logout-microsoft",
    loader: () => {
      window.location.replace(MICROSOFT_LOGOUT_URL);
      return null;
    },
  },
]);

export default router;