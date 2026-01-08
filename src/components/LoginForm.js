import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000"; // DIUBAH KE 5000

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError("Server tidak dapat dihubungi di port 5000.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setMessage("Registrasi berhasil, silakan login.");
      setMode("login");
    } catch (err) {
      setError("Gagal terhubung ke server.");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setResetToken(email);
      setMode("reset");
    } catch (err) {
      setError("Server error.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword: newPassword }),
      });
      if (!res.ok) {
        setError("Reset gagal");
        return;
      }
      setMessage("Password diperbarui!");
      setMode("login");
    } catch (err) {
      setError("Koneksi gagal.");
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-box"
        onSubmit={
          mode === "login"
            ? handleLogin
            : mode === "register"
            ? handleRegister
            : handleForgot
        }
      >
        <h2 className="login-title">RaidAnalist</h2>
        {mode !== "reset" && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        {(mode === "login" || mode === "register") && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        {mode === "reset" && (
          <>
            <input
              type="email"
              placeholder="Confirm Email"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-btn"
              onClick={handleResetPassword}
            >
              Update Password
            </button>
          </>
        )}
        {mode !== "reset" && (
          <button className="login-btn" type="submit">
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Register"
              : "Reset"}
          </button>
        )}
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <div className="login-links">
          {mode === "login" && (
            <>
              <button type="button" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
              <button type="button" onClick={() => setMode("register")}>
                Create account
              </button>
            </>
          )}
          {mode !== "login" && (
            <button type="button" onClick={() => setMode("login")}>
              Back to login
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
