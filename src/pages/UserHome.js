import React, { useState } from "react";
import SolicitudSuscripcion from "./userpages/SolicitudSuscripcion";
import CrearOrden from "./userpages/CrearOrden";
import MisOrdenes from "./userpages/MisOrdenes";


const UserHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "solicitud-suscripcion":
        return <SolicitudSuscripcion />;
      case "crear-orden":
        return <CrearOrden />;
      case "ordenes":
        return <MisOrdenes />;
      default:
        return <div>Selecciona una opción.</div>;
    }
  };

  return (
    <div>
      <h1>User Home</h1>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => setActiveComponent("solicitud-suscripcion")}>
          Solicitud de Suscripción
        </button>
        <button onClick={() => setActiveComponent("crear-orden")}>
          Crear Orden
        </button>
        <button onClick={() => setActiveComponent("ordenes")}>
          Órdenes
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>{renderActiveComponent()}</div>
    </div>
  );
};

export default UserHome;

