import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [ctaText, setCtaText] = useState('');
  const [isCtaTyping, setIsCtaTyping] = useState(false);
  const ctaFullText = "¿Listo para conectar?";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Trigger CTA typewriter when scrolling to that section
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection && !isCtaTyping) {
        const rect = ctaSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setIsCtaTyping(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCtaTyping]);

  // Typewriter effect for hero text
  useEffect(() => {
    const words = ["Conectamos?", "Innovamos?", "Crecemos?"];
    const currentText = words[currentWord];
    let timeoutId;
    
    if (isTyping) {
      // Typing effect
      if (displayText.length < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 150);
      } else {
        // Pause before erasing
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Erasing effect
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 100);
      } else {
        // Move to next word and start typing
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, currentWord, isTyping]);

  // Typewriter effect for CTA text
  useEffect(() => {
    if (!isCtaTyping) return;
    
    let timeoutId;
    if (ctaText.length < ctaFullText.length) {
      timeoutId = setTimeout(() => {
        setCtaText(ctaFullText.slice(0, ctaText.length + 1));
      }, 100);
    }

    return () => clearTimeout(timeoutId);
  }, [ctaText, isCtaTyping, ctaFullText]);

  return (
    <div className="modern-landing">
      {/* Navigation */}
      <nav className={`modern-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span>CoNetIng</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/registro" className="nav-button">Comenzar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Plataforma #1 en México
            </div>
            
            <h1 className="hero-title">
              <span className="title-main">CoNetIng México</span>
              <span className="title-sub">
                ¿
                <span className="animated-word">
                  {displayText}
                </span>
              </span>
            </h1>
            
            <p className="hero-description">
              Redefiniendo la conexión entre personas y negocios.<br/>
              Descubre, conecta y apoya a negocios locales desde tu comunidad.
            </p>

            <div className="hero-actions">
              <Link to="/registro" className="primary-btn">
                <span>Comenzar Ahora</span>
                <div className="btn-arrow">→</div>
              </Link>
              <Link to="/login" className="secondary-btn">
                Iniciar Sesión
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Negocios</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">5K+</div>
                <div className="stat-label">Usuarios</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">México</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-elements">
              <div className="float-card card-1">
                <div className="card-emoji">🔍</div>
                <span>Explora</span>
              </div>
              <div className="float-card card-2">
                <div className="card-emoji">🛒</div>
                <span>Compra</span>
              </div>
              <div className="float-card card-3">
                <div className="card-emoji">🤝</div>
                <span>Conecta</span>
              </div>
              <div className="float-card card-4">
                <div className="card-emoji">⭐</div>
                <span>Califica</span>
              </div>
            </div>
            <div className="central-logo">
              <img src={logo} alt="CoNetIng Logo" className="hero-logo" />
              <div className="logo-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">¿Qué puedes hacer?</h2>
            <p className="section-subtitle">Descubre todas las posibilidades</p>
          </div>

          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <span>🔍</span>
              </div>
              <h3>Explora negocios en tu zona</h3>
              <p>Encuentra los mejores negocios locales cerca de ti con geolocalización precisa.</p>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <span>🛒</span>
              </div>
              <h3>Realiza pedidos fácilmente</h3>
              <p>Sistema intuitivo para conectar directamente con negocios locales.</p>
            </div>

            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <span>🤝</span>
              </div>
              <h3>Conecta con tus vecinos</h3>
              <p>Construye una comunidad sólida apoyando negocios junto a tu vecindario.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              {ctaText}
            </h2>
            <p className="cta-description">
              Únete a miles de usuarios que están transformando su comunidad
            </p>
            <div className="cta-actions">
              <Link to="/registro" className="cta-primary">
                Crear cuenta gratuita
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span>CoNetIng México</span>
          </div>
          <div className="footer-text">
            Hecho con ❤️ en México
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;







