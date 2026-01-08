


// frontend/src/landing_page/Home/Signup.js
import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import "./auth.css";

export default function Signup({ close, openLogin }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // sanitize payload
    const payload = {
      username: (form.username || "").toString().trim(),
      email: (form.email || "").toString().trim().toLowerCase(),
      password: (form.password || "").toString(),
    };

    try {
      console.log("Signup: sending payload", { ...payload, password: "[REDACTED]" });

      const res = await fetch("http://localhost:3002/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.message || "Signup failed");
      }

      // auto-login user after signup
      const user = data?.user || null;
      const token = data?.token || data?.accessToken || null;

      if (!user || !token) {
        console.warn("Signup response incomplete:", data);
        // still set login if token present
        if (token) {
          login(user || {}, token);
          localStorage.setItem("hasAccount", "true");
          close();
          return;
        }
        return setError("Signup succeeded but server returned incomplete data.");
      }

      login(user, token);
      localStorage.setItem("hasAccount", "true");
      close();
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal-box" initial={{ y: -90, scale: 0.95 }} animate={{ y: 0, scale: 1 }}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            autoComplete="email"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div style={{ marginTop: 12 }}>
          <small>
            Already have an account?{" "}
            <button
              onClick={() => {
                if (openLogin) openLogin();
              }}
              className="link-button"
            >
              Login
            </button>
          </small>
        </div>

        <button className="close-btn" onClick={close}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}




