import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface User {
  email?: string;
  name: string;
  role: "basic" | "admin";
}

class AuthService {
  private tokenKey = "auth_token";
  private userKey = "auth_user";

  async exchangeCode(code: string, redirectUri: string): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/auth/callback`,
      {
        code,
        redirect_uri: redirectUri,
      }
    );

    // 🔍 Muestra en consola los tokens devueltos por /auth/callback
    console.log("=== RESPUESTA DE /auth/callback ===", response.data);

    return response.data;
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔍 Muestra en consola la información entregada por /auth/me
    console.log("=== RESPUESTA DE /auth/me ===", response.data);

    const data = response.data;

    // Retorna los datos mappeados soportando distintas convenciones de nombres de la API
    return {
      name:
        data.name ||
        data.full_name ||
        data.username ||
        data.given_name ||
        (data.email ? data.email.split("@")[0] : "Usuario"),
      email: data.email || data.user_email || data.email_address || "",
      role: data.role || "basic",
    };
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();