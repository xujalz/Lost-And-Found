import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Optionally verify token and refresh user on load
    const token = localStorage.getItem("token");
    if (token && !user) {
      // Try to get profile (silent)
      api
        .get("/users/me")
        .then(({ data }) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const login = (data) => {
    // data expected: { token, user }
    if (data?.token) localStorage.setItem("token", data.token);
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      // some endpoints may return user directly
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
