import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistroForm from "./RegistroForm";
import Negocios from "./Negocios"; // Importa el componente de negocios
import LogoutButton from "./Logout"; // Importa el componente de negocios

const App = () => {
  const [currentView, setCurrentView] = useState("login"); // Controla la vista actual

  const renderView = () => {
    switch (currentView) {
      case "login":
        return <LoginForm />;
      case "registro":
        return <RegistroForm />;
      case "negocios":
        return <Negocios />;
      case "logout":
        return <LogoutButton />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentView("login")}>
          Login
        </button>
        <button onClick={() => setCurrentView("registro")}>
          Registro
        </button>
        <button onClick={() => setCurrentView("negocios")}>
          Negocios
        </button>
        <button onClick={() => setCurrentView("logout")}>
          Logout
        </button>
      </nav>

      <div className="content">
        {renderView()}
      </div>
    </div>
  );
};

export default App;





