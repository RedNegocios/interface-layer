import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";
import AceptarOrdenes from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes from "./adminpages/HistoricoOrdenes";
import ResumenKPI from "./adminpages/ResumenKPI";
import "./AdminHome.css"; // Estilos nuevos

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
        return <HistoricoOrdenes />;
      case "resumen-kpi":
        return <ResumenKPI negocioId={1} />;
      default:
        return <div className="mensaje-inicial">Selecciona una opción del panel de administración.</div>;
    }
  };

  return (
    <div className="admin-home-container">
      <h1 className="admin-title">Panel de Administración</h1>
      <div className="admin-buttons-grid">
        <button onClick={() => setActiveComponent("solicitud-suscripcion-admin")}>
          Solicitudes de Suscripción
        </button>
        <button onClick={() => setActiveComponent("crear-producto-de-existente")}>
          Añadir Producto desde Existente
        </button>
        <button onClick={() => setActiveComponent("crear-producto-nuevo")}>
          Crear Producto desde Cero
        </button>
        <button onClick={() => setActiveComponent("crud-productos-negocios")}>
          Gestión de Productos por Negocio
        </button>
        <button onClick={() => setActiveComponent("aceptar-ordenes")}>
          Órdenes Pendientes
        </button>
        <button onClick={() => setActiveComponent("historico-ordenes")}>
          Historial de Órdenes
        </button>
        <button onClick={() => setActiveComponent("resumen-kpi")}>
          Indicadores y KPI
        </button>
      </div>
      <div className="admin-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;






