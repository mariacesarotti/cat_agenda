/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "./RegisterPage.scss";
import { useScrollRefs } from "../../hooks/useScrollRefs";
import FormSection from "../FormSection/FormSection";
import CalendarSection from "../CalendarSection/CalendarSection";
export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cadastro, setCadastro] = useState(false);
  const { formRef, scrollTo, calendarRef } = useScrollRefs();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true); // novo

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users", {
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

      // Salva token e userId (igual login depois)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());

      // Redirecionar para Home
      setCadastro(true);
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      setError("Falha ao cadastrar. Verifique os dados.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !cadastro) {
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, [cadastro]);

  if (checkingAuth) {
    return <div>Carregando...</div>; // ou um spinner bonitinho
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

  const handleCadastroFinalizado = () => {
    setCadastro(true);
    setTimeout(() => {
      scrollTo(formRef); // Depois dar o scroll (pequeno delay para dar tempo do form aparecer)
    }, 100);
  };

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
            onClick={handleCadastroFinalizado}
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
