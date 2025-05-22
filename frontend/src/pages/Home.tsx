import React, { useState } from "react";
import HeroSection from "../components/Hero/HeroSection";
import { useScrollRefs } from "../hooks/useScrollRefs";
import { RegisterPage } from "../components/RegisterPage/RegisterPage";
import { LoginPage } from "../components/LoginPage/LoginPage";
import FormSection from "../components/FormSection/FormSection";
import CalendarSection from "../components/CalendarSection/CalendarSection";

interface Event {
  date: string;
  type: string;
  cat: string;
  description: string;
}

export const Home: React.FC = () => {
  const { registerRef, loginRef, scrollTo } = useScrollRefs();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);
  const [formCompleted, setFormCompleted] = useState(false);

  const registerClick = () => {
    setShowRegister(true);
    setShowLogin(false);
    setFormCompleted(false);
    setTimeout(() => {
      scrollTo(registerRef);
    }, 100);
  };

  const loginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setFormCompleted(false);
    setTimeout(() => {
      scrollTo(loginRef);
    }, 100);
  };

  const handleFormSubmit = (events: Event[]) => {
    setCalendarEvents(events);
    setFormCompleted(true);
    // Se quiser redirecionar para /admin só aqui, use:
    // navigate("/admin");
  };

  return (
    <div>
      <HeroSection
        handleRegisterClick={registerClick}
        handleLogin={loginClick}
      />

      {showLogin && (
        <div ref={loginRef}>
          <LoginPage />
        </div>
      )}

      {showRegister && (
        <div ref={registerRef}>
          <RegisterPage />
        </div>
      )}

      {/* Exibe o formulário apenas se não estiver em login, registro ou formulário já finalizado */}
      {!showLogin && !showRegister && !formCompleted && (
        <FormSection onSubmitForm={handleFormSubmit} />
      )}

      {/* Exibe o calendário apenas após o formulário ser finalizado */}
      {!showLogin && !showRegister && formCompleted && (
        <CalendarSection events={calendarEvents} />
      )}
    </div>
  );
};
