import React, { useState } from "react";
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";
import CrearOrden from "./adminpages/CrearOrden";
import AceptarOrdenes from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes from "./adminpages/HistoricoOrdenes";
import ResumenKPI from "./adminpages/ResumenKPI";
import "./AdminHome.css";
import logo from "../assets/logo.png"; // Asegúrate de que el logo esté en esta ruta

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      case "crear-orden":
        return <CrearOrden />;
      case "aceptar-ordenes":
        return <AceptarOrdenes />;
      case "historico-ordenes":
        return <HistoricoOrdenes />;
      case "resumen-kpi":
        return <ResumenKPI negocioId={1} />;
      default:
        return (
          <div className="mensaje-inicial">
            Selecciona una opción del menú principal.
          </div>
        );
    }
  };

  return (
    <div className="admin-home-container">
      <button
        className="hamburger-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="menu-box">
          <h3 className="menu-title">Menú Admin</h3>
          <div className="menu-buttons">
            <button onClick={() => { setActiveComponent("solicitud-suscripcion-admin"); setMenuOpen(false); }}>
              Suscripciones a Negocios
            </button>
            <button onClick={() => { setActiveComponent("crear-producto-de-existente"); setMenuOpen(false); }}>
              Añadir Producto desde Existente
            </button>
            <button onClick={() => { setActiveComponent("crear-producto-nuevo"); setMenuOpen(false); }}>
              Crear Producto desde Cero
            </button>
            <button onClick={() => { setActiveComponent("crud-productos-negocios"); setMenuOpen(false); }}>
              Gestión de Productos
            </button>
            <button onClick={() => { setActiveComponent("crear-orden"); setMenuOpen(false); }}>
              Crear Orden
            </button>
            <button onClick={() => { setActiveComponent("aceptar-ordenes"); setMenuOpen(false); }}>
              Órdenes Pendientes
            </button>
            <button onClick={() => { setActiveComponent("historico-ordenes"); setMenuOpen(false); }}>
              Historial de Órdenes
            </button>
            <button onClick={() => { setActiveComponent("resumen-kpi"); setMenuOpen(false); }}>
              Indicadores y KPI
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={logo}
          alt="CoNetIng Logo"
          style={{
            height: "100px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;


