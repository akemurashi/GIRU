import { createBrowserRouter } from "react-router-dom";

import Inicio from "../modulos/inicio/paginas/PaginaInicio";
import Documentos from "../modulos/Documentos/Pagina/PaginaDocumento";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
  },
  {
    path: "/documentos",
    element: <Documentos />,
  },
]);

export default router;