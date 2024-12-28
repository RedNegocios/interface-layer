import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegistroForm from "./RegistroForm";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <LoginForm /> : <RegistroForm />}
      <button onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? "Ir a Registro" : "Ir a Login"}
      </button>
    </div>
  );
};

export default App;




