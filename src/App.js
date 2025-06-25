import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

import LoginForm from "./componentes/forms/LoginForm";
import RegistroForm from "./componentes/forms/RegistroForm";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import LandingPage from "./pages/LandingPage";
import logo from "./assets/logo.png"; // ✅ Importa tu logo

import "./App.css";

// Protección de rutas según rol
const ProtectedRoute = ({ rolesAllowed, children }) => {
  const token = localStorage.getItem("authToken");
  const authorities = JSON.parse(localStorage.getItem("authorities")) || [];

  const isAuthenticated = !!token;
  const hasAccess = rolesAllowed.some((role) =>
    authorities.some((auth) => auth.authority === role)
  );

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Encapsula rutas y header si no es landing
const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authorities");
    alert("Sesión cerrada");
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Header solo si no estás en landing */}
      {!isLanding && (
        <header className="app-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="Logo CoNetIng" style={{ height: "50px" }} />
            <h1 className="app-title">CoNetIng México S.A de C.V</h1>
          </div>
          <nav className="app-nav">
            {!localStorage.getItem("authToken") ? (
              <>
                <Link to="/login">
                  <button>Iniciar Sesión</button>
                </Link>
                <Link to="/registro">
                  <button>Registrarse</button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout}>Cerrar Sesión</button>
            )}
          </nav>
        </header>
      )}

      {/* Contenido principal */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegistroForm />} />
          <Route
            path="/admin-negocio/home"
            element={
              <ProtectedRoute rolesAllowed={["ROLE_ADMIN_NEGOCIO"]}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/home"
            element={
              <ProtectedRoute rolesAllowed={["ROLE_USER"]}>
                <UserHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// Router principal
const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;



















