import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Sección del banner */}
      <section className="hero-banner">
        <img src={logo} alt="CoNetIng Logo" className="landing-logo" />
        <div className="hero-buttons">
          <Link to="/login">
            <button>Iniciar Sesión</button>
          </Link>
          <Link to="/registro">
            <button>¡Regístrate!</button>
          </Link>
        </div>
      </section>

      {/* Sección de información */}
      <section className="info-section">
        <h2>Redefiniendo la conexión entre personas y negocios</h2>
        <p>Descubre, conecta y apoya a negocios locales desde tu comunidad.</p>

        <h3>¿Qué puedes hacer en CoNetIng México?</h3>
        <ul>
          <li>🔍 Explora negocios en tu zona</li>
          <li>🛒 Realiza pedidos fácilmente</li>
          <li>🤝 Conecta con tus vecinos</li>
        </ul>
      </section>

      <footer className="footer">Hecho en México</footer>
    </div>
  );
};

export default LandingPage;







