import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { normalizeError } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated(),
  );
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    // Keep auth state in sync if the token is cleared elsewhere (e.g. a 401
    // interceptor in api.js).
    const syncFromStorage = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setUser(authService.getUser());
    };
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  async function login(email, password) {
    try {
      const data = await authService.login(email, password);
      setUser(data?.user || null);
      setIsAuthenticated(true);
      return { success: true, user: data?.user || null };
    } catch (error) {
      return { success: false, error: normalizeError(error) };
    }
  }

  function logout() {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
