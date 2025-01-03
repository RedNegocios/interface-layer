import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "solicitud-suscripcion-admin":
        return <SolicitudSuscripcionAdmin />;
      default:
        return <div>Selecciona una opción.</div>;
    }
  };

  return (
    <div>
      <h1>User Home</h1>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => setActiveComponent("solicitud-suscripcion-admin")}>
          Solicitud de Suscripción
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome; // Exportación por defecto
