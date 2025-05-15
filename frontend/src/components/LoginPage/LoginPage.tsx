/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";


const API_URL = import.meta.env.VITE_API_URL;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Falha no login");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError("Email ou senha incorretos.");
    }
  };

  return (
    <section className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">sign in to access the mission</h2>
        <input
          type="email"
          placeholder="email address registered in the resistance"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="secret code"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          infiltrate
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </section>
  );
};
