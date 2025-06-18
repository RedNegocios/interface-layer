import React, { useState } from "react";
import SolicitudSuscripcion from "./userpages/SolicitudSuscripcion";
import CrearOrden from "./userpages/CrearOrden";
import MisOrdenes from "./userpages/MisOrdenes";
import "./UserHome.css";

const UserHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="user-layout">
      <button className="hamburger-button-user" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {menuOpen && (
        <div className="user-side-menu">
          <h3 className="menu-title">Menú Usuario</h3>
          <div className="user-buttons-menu">
            <button onClick={() => { setActiveComponent("solicitud-suscripcion"); setMenuOpen(false); }}>
              Suscripción a negocio
            </button>
            <button onClick={() => { setActiveComponent("crear-orden"); setMenuOpen(false); }}>
              Hacer Nueva Orden
            </button>
            <button onClick={() => { setActiveComponent("ordenes"); setMenuOpen(false); }}>
              Mis Órdenes
            </button>
          </div>
        </div>
      )}

      <div className="user-home-container">
        <h1 className="user-title">Panel del Usuario</h1>
        <div className="user-content">{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default UserHome;


