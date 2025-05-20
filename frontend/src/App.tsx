// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./components/LoginPage/LoginPage";
// import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { RegisterPage } from "./components/RegisterPage/RegisterPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import CalendarSection from "./components/CalendarSection/CalendarSection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/calendar" element={<CalendarSection events={[]} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
