import React, { useState } from "react";
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

const AdminHome = () => {
  const [active, setActive]   = useState(null);
  const [drawer, setDrawer]   = useState(false);

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
    }
  };

  return (
    <div className="admin-home-container">

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
    </div>
  );
};

export default AdminHome;
