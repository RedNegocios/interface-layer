import React, { useState } from "react";
import SolicitudSuscripcion from "./userpages/SolicitudSuscripcion";
import CrearOrden from "./userpages/CrearOrden";
import MisOrdenes from "./userpages/MisOrdenes";
import "./UserHome.css";

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
        return (
          <div className="mensaje-inicial">
            Bienvenido. Selecciona una opción para comenzar.
          </div>
        );
    }
  };

  return (
    <div className="user-home-container">
      <h1 className="user-title">Panel del Usuario</h1>
      <div className="user-buttons-grid">
        <button onClick={() => setActiveComponent("solicitud-suscripcion")}>
          Solicitar Suscripción
        </button>
        <button onClick={() => setActiveComponent("crear-orden")}>
          Hacer Nueva Orden
        </button>
        <button onClick={() => setActiveComponent("ordenes")}>
          Mis Órdenes
        </button>
      </div>
      <div className="user-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default UserHome;

