import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { authService, type User } from "../../services/authService";

export const SidebarFooter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <footer className="p-4 border-t border-white/10">
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            label="Cerrar sesión"
            onClick={handleLogout}
            className="w-full p-button-sm p-button-outlined"
            style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
          />
        </div>
      ) : (
        <p className="text-xs text-white/60">
          Universidad Técnica Federico Santa María
        </p>
      )}
    </footer>
  );
};