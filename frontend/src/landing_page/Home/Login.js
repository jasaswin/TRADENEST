



// frontend/src/landing_page/Home/Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../AuthContext";
import "./auth.css";

export default function Login({ close, openSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      const token = data.token || data?.data?.token;
      const user = data.user || data?.data?.user || data?.userData || null;

      login(user, token);

      if (typeof close === "function") close();

      // small event to signal other components (optional)
      try { window.dispatchEvent(new Event("auth:changed")); } catch (_) {}
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal-box" initial={{ y: -80, scale: 0.95 }} animate={{ y: 0, scale: 1 }}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />

          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div style={{ marginTop: 12 }}>
          <small>
            Don't have an account?{" "}
            <button onClick={() => openSignup && openSignup()} className="link-button">Sign up</button>
          </small>
        </div>

        <button className="close-btn" onClick={close}>Close</button>
      </motion.div>
    </motion.div>
  );
}



