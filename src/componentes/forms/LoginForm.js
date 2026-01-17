import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl, ENDPOINTS, getFetchOptions } from "../../config/api";
import "./LoginForm.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        buildApiUrl(ENDPOINTS.LOGIN), 
        getFetchOptions('POST', credentials)
      );

      if (response.ok) {
        const data = await response.json();

        // Guarda el token y autoridades en localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authorities", JSON.stringify(data.autoridades));
        localStorage.setItem("userId", String(data.usuarioId));

        // Verifica roles y redirige
        const roles = data.autoridades.map((auth) => auth.authority);

        if (roles.includes("ROLE_ADMIN_NEGOCIO")) {
          navigate("/admin-negocio/home");
        } else if (roles.includes("ROLE_USER")) {
          navigate("/user/home");
        } else {
          alert("No tienes acceso autorizado.");
        }

        // Refresca la página después de la redirección
        window.location.reload();
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

