import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { authService } from "../../../services/authService";

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
        // Exchange code for tokens - the redirect URI must match what was sent to Cognito
        const redirectUri = "http://localhost:5173/callback";
        const tokens = await authService.exchangeCode(code, redirectUri);

        // Store the access token
        authService.setToken(tokens.access_token);

        // Get user information
        const user = await authService.getCurrentUser(tokens.id_token || tokens.access_token);
        authService.setUser(user);

        // Redirect to home page
        navigate("/");
      } catch (err) {
        console.error("Auth error:", err);
        setError("Error al procesar la autenticación. Por favor intenta nuevamente.");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ProgressSpinner className="mb-4" />
        <p className="text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}