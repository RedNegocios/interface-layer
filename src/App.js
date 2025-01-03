import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import LoginForm from "./componentes/forms/LoginForm";
import RegistroForm from "./componentes/forms/RegistroForm";
import AdminHome from "./pages/AdminHome"; // Importa el archivo separado para AdminHome
import UserHome from "./pages/UserHome";   // Importa el archivo separado para UserHome
import "./App.css"

const ProtectedRoute = ({ rolesAllowed, children }) => {
  const token = localStorage.getItem("authToken");
  const authorities = JSON.parse(localStorage.getItem("authorities")) || [];

  const isAuthenticated = !!token;
  const hasAccess = rolesAllowed.some((role) =>
    authorities.some((auth) => auth.authority === role)
  );

  if (!isAuthenticated) {
    console.warn("ProtectedRoute - User is not authenticated. Redirecting to Login.");
    return <Navigate to="/" />;
  }

  if (!hasAccess) {
    console.warn("ProtectedRoute - User does not have the required role. Redirecting to Login.");
    return <Navigate to="/" />;
  }

  console.log("ProtectedRoute - Access Granted");
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
      <div>
        {/* Barra de Navegación */}
        <nav>
          {!localStorage.getItem("authToken") && (
            <>
              <Link to="/">
                <button>Login</button>
              </Link>
              <Link to="/registro">
                <button>Registro</button>
              </Link>
            </>
          )}
          {localStorage.getItem("authToken") && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>

        {/* Rutas */}
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
      </div>
    </Router>
  );
};

export default App;














