import React, { useState } from "react";

/*  ↳ Páginas de administrador  */
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
<<<<<<< HEAD
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";
import CrearOrden from "./adminpages/CrearOrden";
import AceptarOrdenes from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes from "./adminpages/HistoricoOrdenes";
import ResumenKPI from "./adminpages/ResumenKPI";
import "./AdminHome.css";
import logo from "../assets/logo.png"; // Asegúrate de que el logo esté en esta ruta
=======
import CrearProductoDeExistente   from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo         from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios      from "./adminpages/CrudProductosNegocios";
import AceptarOrdenes             from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes           from "./adminpages/HistoricoOrdenes";
import ResumenKPI                 from "./adminpages/ResumenKPI";

/*  ↳ Páginas que ya existen para el usuario y que ahora
      también estarán disponibles al administrador        */
import CrearOrden  from "./userpages/CrearOrden";
import MisOrdenes  from "./userpages/MisOrdenes";

import "./AdminHome.css";
>>>>>>> feature/UIUX

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------- qué componente mostrar ---------- */
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
<<<<<<< HEAD
      case "crear-orden":
        return <CrearOrden />;
=======

>>>>>>> feature/UIUX
      case "aceptar-ordenes":
        return <AceptarOrdenes />;

      case "historico-ordenes":
        return <HistoricoOrdenes />;

      case "resumen-kpi":
        /*  ← Si el negocio se determina dinámicamente,
              cámbialo por la prop adecuada              */
        return <ResumenKPI negocioId={2} />;

      /*  NUEVOS — funciones de usuario disponibles para admin  */
      case "crear-orden":
        return <CrearOrden />;

      case "ordenes":
        return <MisOrdenes />;

      default:
        return (
          <div className="mensaje-inicial">
<<<<<<< HEAD
            Selecciona una opción del menú principal.
=======
            Selecciona una opción del panel de administración.
>>>>>>> feature/UIUX
          </div>
        );
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="admin-home-container">
<<<<<<< HEAD
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

=======
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-buttons-grid">
        {/* Bloque de botones de administración */}
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

        {/* NUEVOS botones que exponen funciones de usuario */}
        <button onClick={() => setActiveComponent("crear-orden")}>
          Hacer Nueva Orden
        </button>
        <button onClick={() => setActiveComponent("ordenes")}>
          Mis Órdenes
        </button>
      </div>

>>>>>>> feature/UIUX
      <div className="admin-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;


