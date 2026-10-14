import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../../services/authService";
import PantallaCargaVideo from "../Componentes/PantallaCargaVideo";

export default function PaginaCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Error de autenticación: ${errorParam}`);
        return;
      }

      if (!code) {
        setError("No se recibió código de autorización");
        return;
      }

      try {
        const redirectUri = "http://localhost:5173/callback";
        const tokens = await authService.exchangeCode(code, redirectUri);
        const token = tokens.id_token || tokens.access_token;

        authService.setToken(token);

        const user = await authService.getCurrentUser(token);
        authService.setUser(user);

        navigate("/");
      } catch (err) {
        console.error("Auth error:", err);
        setError(
          "Error al procesar la autenticación. Por favor intenta nuevamente."
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="mb-5 text-red-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <PantallaCargaVideo
      mensaje="Verificando tu sesión"
      subtitulo="Estamos validando tus credenciales y preparando tu acceso."
    />
  );
}
