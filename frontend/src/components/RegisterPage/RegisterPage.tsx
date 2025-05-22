/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "./RegisterPage.scss";
import { useScrollRefs } from "../../hooks/useScrollRefs";
import FormSection from "../FormSection/FormSection";
import CalendarSection from "../CalendarSection/CalendarSection";

const API_URL = import.meta.env.VITE_API_URL;

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cadastro, setCadastro] = useState(false);
  const { formRef, scrollTo, calendarRef } = useScrollRefs();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.json();

      // Salva token e userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());

      // Só mostra o formulário de gatos após cadastro bem-sucedido
      setCadastro(true);
      setTimeout(() => {
        scrollTo(formRef);
      }, 100);
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      setError("Falha ao cadastrar. Verifique os dados.");
    }
  };

  useEffect(() => {
     setCheckingAuth(false);
  }, [cadastro]);

  if (checkingAuth) {
    return <div>Carregando...</div>;
  }

  const token = localStorage.getItem("token");
  if (token && !cadastro) {
    return (
      <section className="register-container">
        <h2 className="register-title">Você já está logado!</h2>
        <p className="register-subtitle">
          Você já está logado. Para criar uma nova conta, faça logout primeiro.
        </p>
      </section>
    );
  }

  const handleFormFinished = (events: any) => {
    setCalendarEvents(events);
    setTimeout(() => {
      scrollTo(calendarRef);
    }, 100);
  };

  return (
    <>
      <section className="register-container">
        <h2 className="register-title">create account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="register-button"
          >
            register
          </button>
          {error && <p className="register-error">{error}</p>}
        </form>
      </section>

      {cadastro && (
        <div id="form-section" ref={formRef}>
          <FormSection onSubmitForm={handleFormFinished} />
        </div>
      )}

      {calendarEvents.length > 0 && (
        <section id="calendar-section" ref={calendarRef} className="p-4">
          <CalendarSection events={calendarEvents} />
        </section>
      )}
    </>
  );
};
