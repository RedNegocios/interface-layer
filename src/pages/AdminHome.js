import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo"; // Importar el nuevo componente
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";


const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "solicitud-suscripcion-admin":
        return <SolicitudSuscripcionAdmin />;
      case "crear-producto-de-existente":
        return <CrearProductoDeExistente />;
      case "crear-producto-nuevo":
        return <CrearProductoNuevo />; // Renderiza el nuevo componente
      case "crud-productos-negocios":
        return <CrudProductosNegocios />;
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
      </div>
      <div style={{ marginTop: "20px" }}>{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;



