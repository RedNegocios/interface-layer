import React, { useState } from "react";
<<<<<<< HEAD

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
=======
import {
  FaBars, FaTimes, FaStore, FaPlusSquare, FaBoxes, FaClipboardList,
  FaShoppingCart, FaHistory, FaChartBar
} from "react-icons/fa";

import SolicitudSuscripcionAdmin  from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente   from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo         from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios      from "./adminpages/CrudProductosNegocios";
import CrearOrden                 from "./adminpages/CrearOrden";
import AceptarOrdenes             from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes           from "./adminpages/HistoricoOrdenes";
import ResumenKPI                 from "./adminpages/ResumenKPI";

import "./AdminHome.css";
import logo from "../assets/logo.png";
>>>>>>> feature/pagination

const AdminHome = () => {
  const [active, setActive]   = useState(null);
  const [drawer, setDrawer]   = useState(false);

<<<<<<< HEAD
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
=======
  /* ---------- helper ---------- */
  const choose = (comp) => { setActive(comp); setDrawer(false); };

  const render = () => {
    switch (active) {
      case "suscripciones":    return <SolicitudSuscripcionAdmin />;
      case "producto-exist":   return <CrearProductoDeExistente />;
      case "producto-nuevo":   return <CrearProductoNuevo />;
      case "crud-productos":   return <CrudProductosNegocios />;
      case "crear-orden":      return <CrearOrden />;
      case "pendientes":       return <AceptarOrdenes />;
      case "historico":        return <HistoricoOrdenes />;
      case "kpi":              return <ResumenKPI negocioId={1} />;
      default: return <div className="mensaje-inicial">Selecciona una opción del menú principal.</div>;
>>>>>>> feature/pagination
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="admin-home-container">
<<<<<<< HEAD
<<<<<<< HEAD
      <button
        className="hamburger-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
=======
>>>>>>> feature/pagination

      {/* ---- Top bar ---- */}
      <header className="topbar">
        <button className="hamburger" onClick={() => setDrawer(true)}>
          <FaBars />
        </button>

        <img src={logo} alt="logo" className="logo" />
        <h1 className="admin-title">Panel de Administración</h1>
      </header>

      {/* ---- Backdrop ---- */}
      <div
        className={`backdrop ${drawer ? "show" : ""}`}
        onClick={() => setDrawer(false)}
      />

<<<<<<< HEAD
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
=======
      {/* ---- Drawer ---- */}
      <nav className={`drawer ${drawer ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setDrawer(false)}>
          <FaTimes />
        </button>

        <h3>Menú Admin</h3>
        <ul>
          <li onClick={() => choose("suscripciones")} >
            <FaStore /><span>Suscripciones a Negocios</span>
          </li>
          <li onClick={() => choose("producto-exist")} >
            <FaPlusSquare /><span>Añadir Producto Existente</span>
          </li>
          <li onClick={() => choose("producto-nuevo")} >
            <FaBoxes /><span>Crear Producto desde Cero</span>
          </li>
          <li onClick={() => choose("crud-productos")} >
            <FaClipboardList /><span>Gestión de Productos</span>
          </li>
          <li onClick={() => choose("crear-orden")} >
            <FaShoppingCart /><span>Crear Orden</span>
          </li>
          <li onClick={() => choose("pendientes")} >
            <FaClipboardList /><span>Órdenes Pendientes</span>
          </li>
          <li onClick={() => choose("historico")} >
            <FaHistory /><span>Historial de Órdenes</span>
          </li>
          <li onClick={() => choose("kpi")} >
            <FaChartBar /><span>Indicadores y KPI</span>
          </li>
        </ul>

        <footer>© 2025 RedNegocios</footer>
      </nav>

      {/* ---- contenido dinámico ---- */}
      <div className="admin-content">{render()}</div>
>>>>>>> feature/pagination
    </div>
  );
};

export default AdminHome;
