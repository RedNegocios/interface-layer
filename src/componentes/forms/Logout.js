import React from "react";
import "./LogoutButton.css";

const LogoutButton = () => {
  const handleLogout = () => {
    // Eliminar el token y las autoridades del localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authorities");

    // Refrescar la página para actualizar el estado de autenticación
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;

  
