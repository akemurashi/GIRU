import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

export default function PaginaLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLogin = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get login URL from backend
        const response = await axios.get("http://localhost:8000/api/v1/auth/login-url");
        
        // Check if user is already authenticated
        const token = localStorage.getItem("auth_token");
        if (token) {
          navigate("/");
          return;
        }
        
        // Redirect to Cognito login
        window.location.href = response.data.url;
      } catch (err) {
        setError("Error al iniciar sesión. Por favor intenta nuevamente.");
        setLoading(false);
      }
    };

    handleLogin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ProgressSpinner className="mb-4" />
          <p className="text-gray-600">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            label="Reintentar" 
            onClick={() => window.location.reload()}
            className="p-button-primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ProgressSpinner className="mb-4" />
        <p className="text-gray-600">Redirigiendo a login...</p>
      </div>
    </div>
  );
}