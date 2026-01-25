import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../assets/logo.png";
import BooksList from "../componentes/BooksList";

const LandingPage = () => {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [ctaText, setCtaText] = useState("");
  const [isCtaTyping, setIsCtaTyping] = useState(false);
  const ctaFullText = "¿Listo para descubrir?";
  const scrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const ctaTriggeredRef = useRef(false);

  // Memoized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const now = Date.now();
    // Throttle to max 100ms between updates
    if (now - lastScrollTimeRef.current < 100) return;

    lastScrollTimeRef.current = now;
    scrollYRef.current = window.scrollY;

    // Only update state when crossing the 50px threshold
    const shouldBeScrolled = scrollYRef.current > 50;
    setIsNavScrolled((prev) =>
      prev !== shouldBeScrolled ? shouldBeScrolled : prev,
    );

    // Trigger CTA typewriter when scrolling to that section (only once)
    if (!ctaTriggeredRef.current) {
      const ctaSection = document.querySelector(".cta-section");
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          ctaTriggeredRef.current = true;
          setIsCtaTyping(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Typewriter effect for hero text
  useEffect(() => {
    const words = ["Descubrimos?", "Leemos?", "Coleccionamos?"];
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
      <nav className={`modern-nav ${isNavScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span>Librería Antigua</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="nav-button">
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Librería de tesoros literarios
            </div>

            <h1 className="hero-title">
              <span className="title-main">Librería Antigua</span>
              <span className="title-sub">
                ¿<span className="animated-word">{displayText}</span>
              </span>
            </h1>

            <p className="hero-description">
              Tu destino para libros antiguos y de colección.
              <br />
              Encuentra joyas literarias únicas con historia y carácter.
            </p>

            <div className="hero-actions">
              <Link to="/registro" className="primary-btn">
                <span>Explorar Catálogo</span>
                <div className="btn-arrow">→</div>
              </Link>
              <Link to="/login" className="secondary-btn">
                Iniciar Sesión
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Libros</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Años de Historia</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Auténticos</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-elements">
              <div className="float-card card-1">
                <div className="card-emoji">♻️</div>
                <span>Recicla</span>
              </div>
              <div className="float-card card-2">
                <div className="card-emoji">📖</div>
                <span>Lee</span>
              </div>
              <div className="float-card card-3">
                <div className="card-emoji">💎</div>
                <span>Colecciona</span>
              </div>
              <div className="float-card card-4">
                <div className="card-emoji">🎁</div>
                <span>Regala</span>
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
            <h2 className="section-title">¿Qué puedes encontrar?</h2>
            <p className="section-subtitle">
              La mayor diversidad en libros antiguos y de colección
            </p>
          </div>

          <div className="features-grid">
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="feature-icon">
                <span>📚🧠🌍</span>
              </div>
              <h3>Enciclopedias</h3>
              <p>Descubre conocimiento universal en ediciones clásicas</p>
              <BooksList category="Enciclopedias" size={5} />
            </div>

            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="feature-icon">
                <span>📖✨❤️</span>
              </div>
              <h3>Novelas</h3>
              <p>Historias clásicas que han marcado generaciones</p>
              <BooksList category="Novelas" size={5} />
            </div>

            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="feature-icon">
                <span>📘⚙️💡</span>
              </div>
              <h3>Libros técnicos</h3>
              <p>Conocimiento especializado y referencias profesionales</p>
              <BooksList category="Libros técnicos" size={5} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{ctaText}</h2>
            <p className="cta-description">
              Únete a nuestra comunidad de amantes de los libros clásicos
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
            <span>Librería Antigua</span>
          </div>
          <div className="footer-text">
            Preservando historias con ❤️ desde México
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
