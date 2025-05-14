/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users/login", {
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

      // Salvar token e userId no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());

      // Redirecionar para Home
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError("Email ou senha incorretos.");
    }
  };

  return (
    <section className="login-container">
      <h2 className="login-title">Entrar</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Entrar
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </section>
  );
};
