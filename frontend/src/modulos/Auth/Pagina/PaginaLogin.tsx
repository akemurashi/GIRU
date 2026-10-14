import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PantallaCargaVideo from "../Componentes/PantallaCargaVideo";

export default function PaginaLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const handleLogin = async () => {
      const token = localStorage.getItem("auth_token");

      if (token) {
        navigate("/", { replace: true });
        return;
      }

      // Si venimos de un logout, forzamos que Microsoft pida credenciales
      const force = localStorage.getItem("force_login") === "1";

      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/auth/login-url",
          { params: { force } }
        );

        if (cancelled) return;

        const loginUrl = response.data?.url;

        if (!loginUrl) {
          throw new Error("El servidor no devolvió la URL de inicio de sesión");
        }

        // Se consume la marca solo cuando ya vamos a redirigir
        localStorage.removeItem("force_login");
        window.location.href = loginUrl;
      } catch (err) {
        if (cancelled) return;

        console.error("Login error:", err);
        setError("Error al iniciar sesión. Por favor, inténtalo nuevamente.");
      }
    };

    handleLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="mb-5 text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <PantallaCargaVideo
      mensaje="Bienvenido a GIRU"
      subtitulo="Preparando tu acceso seguro a la plataforma institucional."
    />
  );
}