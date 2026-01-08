






// // frontend/src/AuthContext.js
// import React, { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   const login = (userData, userToken) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", userToken);

//     // mark that this user has an account
//     localStorage.setItem("hasAccount", "true");

//     setUser(userData);
//     setToken(userToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");

//     // keep hasAccount = true
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }





// // frontend/src/AuthContext.js (small improvements)
// import React, { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user") || "null")
//   );
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   const login = (userData, userToken) => {
//     if (userData) localStorage.setItem("user", JSON.stringify(userData));
//     if (userToken) localStorage.setItem("token", userToken);

//     localStorage.setItem("hasAccount", "true");

//     setUser(userData || null);
//     setToken(userToken || null);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     // keep hasAccount true (you already set this behavior). If you want to clear it on logout, remove the line below.
//     // localStorage.removeItem("hasAccount");
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }





// frontend/src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // read initial state from localStorage (if any)
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  })();

  const savedToken = localStorage.getItem("token") || null;

  const [user, setUser] = useState(savedUser);
  const [token, setToken] = useState(savedToken);

  // keep a single place to update localStorage whenever auth state changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.warn("Failed to persist user to localStorage", e);
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (userData, userToken) => {
    // normalize shape: if userData contains user, unwrap
    const u = (userData && userData.user) ? userData.user : userData;
    setUser(u || null);
    setToken(userToken || null);

    // also persist immediately (effects will run but do it explicitly)
    try {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      if (userToken) localStorage.setItem("token", userToken);
    } catch (e) {
      console.warn("Auth login storage failed:", e);
    }

    // dispatch event so other parts can react (optional convenience)
    try {
      window.dispatchEvent(new Event("auth:changed"));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // remove locally persisted values
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {}
    try {
      window.dispatchEvent(new Event("auth:changed"));
    } catch (e) {}
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(token && user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
