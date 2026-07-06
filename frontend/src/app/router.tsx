import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/Pagina/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";
import PaginaChatIa from "../modulos/ChatIa/Pagina/PaginaChatIa";

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
  }
]);

export default router;