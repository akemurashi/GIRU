import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/Pagina/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";
import PaginaChatIa from "../modulos/ChatIa/Pagina/PaginaChatIa";
import PaginaFaq from "../modulos/Faq/Pagina/PaginaFaq";
import PaginaAyuda from "../modulos/Ayuda/Pagina/PaginaAyuda";

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
  }
]);

export default router;