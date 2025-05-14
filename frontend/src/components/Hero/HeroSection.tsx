import React from "react";
import "./HeroSection.scss";
import { useNavigate } from "react-router-dom";
import { CatModel } from "../CatModel/CatModel";
import { Canvas } from "@react-three/fiber";
interface HeroSectionProps {
  handleRegisterClick: () => void;
  handleLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  handleRegisterClick,
  handleLogin,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token"); // verifica se tem token

  return (
<section className="hero-container">
  <div className="hero-3d-canvas-background">
    <Canvas camera={{ position: [0, 0, 20] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CatModel />
    </Canvas>
  </div>

  <div className="hero-overlay">
    <h1 className="hero-title">Cat agenda: <br></br>total control</h1>
    <p className="hero-subtitle">
      Because your cat runs the house—you're just here to schedule it
    </p>
    <div className="hero-buttons">
      {!isLoggedIn ? (
        <>
          <button className="hero-login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="hero-register-button" onClick={handleRegisterClick}>
            Sign up
          </button>
        </>
      ) : (
        <button className="hero-logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  </div>
</section>

  );
};

export default HeroSection;
