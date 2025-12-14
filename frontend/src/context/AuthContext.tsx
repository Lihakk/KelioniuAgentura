import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/AxiosInstace";

type AuthContextType = {
  role: string;
  isAuthenticated: boolean;
  isEmailConfirmed: boolean;
  reload: () => Promise<{ authenticated: boolean; confirmed: boolean }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<string>("guest");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);

  const reload = async () => {
    try {
      const res = await apiClient.get("/api/User/Me");

      const confirmed = res.data.isEmailConfirmed === true;
      setRole(res.data.role ?? "guest");
      setIsEmailConfirmed(confirmed);
      setIsAuthenticated(confirmed);

      return { authenticated: confirmed, confirmed };
    } catch {
      setRole("guest");
      setIsEmailConfirmed(false);
      setIsAuthenticated(false);

      return { authenticated: false, confirmed: false };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/User/Logout");
    } finally {
      setRole("guest");
      setIsEmailConfirmed(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        isAuthenticated,
        isEmailConfirmed,
        reload,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
