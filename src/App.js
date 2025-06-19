import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import LoginForm from "./componentes/forms/LoginForm";
import RegistroForm from "./componentes/forms/RegistroForm";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import "./App.css";

const ProtectedRoute = ({ rolesAllowed, children }) => {
  const token = localStorage.getItem("authToken");
  const authorities = JSON.parse(localStorage.getItem("authorities")) || [];

  const isAuthenticated = !!token;
  const hasAccess = rolesAllowed.some((role) =>
    authorities.some((auth) => auth.authority === role)
  );

  if (!isAuthenticated || !hasAccess) {
    console.warn("ProtectedRoute - Redirigiendo a login.");
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authorities");
    alert("Sesión cerrada");
    window.location.reload();
  };

  return (
    <Router>
      <div className="app-container">
        {/* Encabezado con Branding */}
        <header className="app-header">
          <h1 className="app-title">RedLocal</h1>
          <nav className="app-nav">
            {!localStorage.getItem("authToken") ? (
              <>
                <Link to="/">
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

        {/* Contenido principal */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LoginForm />} />
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
    </Router>
  );
};

export default App;















