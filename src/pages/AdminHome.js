import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";
import AceptarOrdenes from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes from "./adminpages/HistoricoOrdenes"; // Import the new component

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "solicitud-suscripcion-admin":
        return <SolicitudSuscripcionAdmin />;
      case "crear-producto-de-existente":
        return <CrearProductoDeExistente />;
      case "crear-producto-nuevo":
        return <CrearProductoNuevo />;
      case "crud-productos-negocios":
        return <CrudProductosNegocios />;
      case "aceptar-ordenes":
        return <AceptarOrdenes />;
      case "historico-ordenes":
        return <HistoricoOrdenes />; // Render the HistoricoOrdenes component
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
        <button onClick={() => setActiveComponent("crear-producto-de-existente")}>
          Crear Producto de Existente
        </button>
        <button onClick={() => setActiveComponent("crear-producto-nuevo")}>
          Crear Producto Nuevo
        </button>
        <button onClick={() => setActiveComponent("crud-productos-negocios")}>
          Gestión de Productos
        </button>
        <button onClick={() => setActiveComponent("aceptar-ordenes")}>
          Aceptar Órdenes
        </button>
        <button onClick={() => setActiveComponent("historico-ordenes")}>
          Ver Histórico de Órdenes
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;





