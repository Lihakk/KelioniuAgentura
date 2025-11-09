// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'guest' | 'user' | 'admin';

type AuthContextValue = {
  role: Role;
  login: (nextRole: Exclude<Role, 'guest'>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem('app.role');
      return (saved as Role) || 'guest';
    } catch {
      return 'guest';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app.role', role);
    } catch {
    }
  }, [role]);

  const login = (nextRole: Exclude<Role, 'guest'>) => setRole(nextRole);
  const logout = () => setRole('guest');

  const value = useMemo(() => ({ role, login, logout }), [role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
