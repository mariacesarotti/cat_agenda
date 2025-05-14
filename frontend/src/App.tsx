// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./components/LoginPage/LoginPage";
// import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { RegisterPage } from "./components/RegisterPage/RegisterPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
