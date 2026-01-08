// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./index.css";
// import Home from "./components/Home";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );




// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./index.css";
// import Home from "./components/Home";

// // --- NEW: SYNC USER FROM FRONTEND (3001) ---
// try {
//   const params = new URLSearchParams(window.location.search);
//   const encodedUser = params.get("user");

//   if (encodedUser) {
//     const decodedUser = JSON.parse(decodeURIComponent(encodedUser));
//     localStorage.setItem("user", JSON.stringify(decodedUser));
//   }
// } catch (e) {
//   console.error("User decode failed:", e);
// }
// // -------------------------------------------

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );







// dashboard/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import { AuthProvider } from "./AuthContext";

// --- SYNC USER + TOKEN FROM FRONTEND (dev-only) ---
// Usage: after frontend login, open: 
//   http://localhost:3000/?user=<urlencoded JSON user>&token=<urlencoded token>
// This allows dashboard (different port) to initialize auth from URL.
// WARNING: this is intended for local dev only. Do NOT use in production.
try {
  const params = new URLSearchParams(window.location.search);

  const encodedUser = params.get("user");
  if (encodedUser) {
    try {
      const decodedUser = JSON.parse(decodeURIComponent(encodedUser));
      localStorage.setItem("user", JSON.stringify(decodedUser));
    } catch (e) {
      console.warn("Failed to decode user param", e);
    }
  }

  const tokenParam = params.get("token");
  if (tokenParam) {
    try {
      const decodedToken = decodeURIComponent(tokenParam);
      localStorage.setItem("token", decodedToken);
    } catch (e) {
      console.warn("Failed to decode token param", e);
    }
  }

  // optionally clear query from URL (cleaner UX)
  if (encodedUser || tokenParam) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }
} catch (e) {
  console.error("User/token decode failed:", e);
}
// --------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
