import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener("menther:session-expired", expire);
    return () => window.removeEventListener("menther:session-expired", expire);
  }, []);
  const login = (user) => setUser(user);
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
