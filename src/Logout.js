import React from "react";

const LogoutButton = () => {
    const handleLogout = () => {
      // Eliminar el token del localStorage
      localStorage.removeItem("authToken");
  
      // Redirigir manualmente recargando la página
      window.location.href = "/login"; // Cambia "/login" por la URL deseada
    };
  
    return (
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    );
  };
  
  export default LogoutButton;
  
