import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import Productos from "./adminpages/Productos"

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "solicitud-suscripcion-admin":
        return <SolicitudSuscripcionAdmin />;
      case "negocio-producto-crud":
        return <Productos />; // Renderiza el nuevo componente
      default:
        return <div>Selecciona una opción.</div>;
    }
  };

  return (
    <div>
      <h1>Admin Home</h1>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => setActiveComponent("solicitud-suscripcion-admin")}>
          Solicitud de Suscripción
        </button>
        <button onClick={() => setActiveComponent("negocio-producto-crud")}>
          Gestión de Negocios y Productos
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;

