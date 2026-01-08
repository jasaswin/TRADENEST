
// dashboard/src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  // initialise from localStorage (safe parse)
  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(readUser());
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // persist whenever values change
  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    } catch (e) {}
  }, [token]);

  const login = (userData, userToken) => {
    const u = userData && userData.user ? userData.user : userData;
    setUser(u || null);
    setToken(userToken || null);

    // persist immediately
    try {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      if (userToken) localStorage.setItem("token", userToken);
    } catch (e) {}
    // notify other parts if they listen
    try { window.dispatchEvent(new Event("auth:changed")); } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {}
    try { window.dispatchEvent(new Event("auth:changed")); } catch (_) {}
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
