import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "clerk";
} | null;

type AuthCtx = {
  user: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const Ctx = createContext<AuthCtx>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <Ctx.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
