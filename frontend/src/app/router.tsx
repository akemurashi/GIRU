import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/Pagina/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";
import PaginaChatIa from "../modulos/ChatIa/Pagina/PaginaChatIa";
import PaginaFaq from "../modulos/Faq/Pagina/PaginaFaq";
import PaginaAyuda from "../modulos/Ayuda/Pagina/PaginaAyuda";
import PaginaLogin from "../modulos/Auth/Pagina/PaginaLogin";
import PaginaCallback from "../modulos/Auth/Pagina/PaginaCallback";

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
  }
]);

export default router;