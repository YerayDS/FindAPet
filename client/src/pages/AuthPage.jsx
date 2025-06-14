import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", loginForm);
      const { token, user } = response.data;

      login(token, user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", registerForm);
      alert("Registration successful! Please log in.");
      setMode("login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button
          className="close-auth-button"
          onClick={() => navigate(from)}
          aria-label="Close authentication page"
        >
          ×
        </button>

        <div className="auth-toggle">
          <button
            onClick={() => setMode("login")}
            className={mode === "login" ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={mode === "register" ? "active" : ""}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Register</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={registerForm.username}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
            <select
              name="role"
              value={registerForm.role}
              onChange={handleRegisterChange}
              required
            >
              <option value="">What do you want to do?</option>
              <option value="adopt">Adopt</option>
              <option value="give_for_adoption">Give for Adoption</option>
            </select>
            <button type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
  );
}