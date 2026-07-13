import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/Pagina/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";
import PaginaChatIa from "../modulos/ChatIa/Pagina/PaginaChatIa";
import PaginaFaq from "../modulos/Faq/Pagina/PaginaFaq";

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
  }
]);

export default router;