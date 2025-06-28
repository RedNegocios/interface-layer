import React, { useState } from "react";

/*  ↳ Páginas de administrador  */
import SolicitudSuscripcionAdmin from "./adminpages/SolicitudSuscripcionAdmin";
import CrearProductoDeExistente from "./adminpages/CrearProductoDeExistente";
import CrearProductoNuevo from "./adminpages/CrearProductoNuevo";
import CrudProductosNegocios from "./adminpages/CrudProductosNegocios";
import AceptarOrdenes from "./adminpages/AceptarOrdenes";
import HistoricoOrdenes from "./adminpages/HistoricoOrdenes";
import ResumenKPI from "./adminpages/ResumenKPI";

/*  ↳ Páginas que también estarán disponibles al administrador */
import CrearOrden from "./userpages/CrearOrden";
import MisOrdenes from "./userpages/MisOrdenes";

import "./AdminHome.css";
import logo from "../assets/logo.png";

import {
  FaBars, FaTimes, FaStore, FaPlusSquare, FaBoxes, FaClipboardList,
  FaShoppingCart, FaHistory, FaChartBar
} from "react-icons/fa";

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [drawer, setDrawer] = useState(false);

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
        return <ResumenKPI negocioId={2} />;
      case "crear-orden":
        return <CrearOrden />;
      case "ordenes":
        return <MisOrdenes />;
      default:
        return (
          <div className="mensaje-inicial">
            Selecciona una opción del panel de administración.
          </div>
        );
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
          <li onClick={() => setActiveComponent("solicitud-suscripcion-admin")}>
            <FaStore /><span>Suscripciones a Negocios</span>
          </li>
          <li onClick={() => setActiveComponent("crear-producto-de-existente")}>
            <FaPlusSquare /><span>Añadir Producto Existente</span>
          </li>
          <li onClick={() => setActiveComponent("crear-producto-nuevo")}>
            <FaBoxes /><span>Crear Producto desde Cero</span>
          </li>
          <li onClick={() => setActiveComponent("crud-productos-negocios")}>
            <FaClipboardList /><span>Gestión de Productos</span>
          </li>
          <li onClick={() => setActiveComponent("crear-orden")}>
            <FaShoppingCart /><span>Crear Orden</span>
          </li>
          <li onClick={() => setActiveComponent("aceptar-ordenes")}>
            <FaClipboardList /><span>Órdenes Pendientes</span>
          </li>
          <li onClick={() => setActiveComponent("historico-ordenes")}>
            <FaHistory /><span>Historial de Órdenes</span>
          </li>
          <li onClick={() => setActiveComponent("resumen-kpi")}>
            <FaChartBar /><span>Indicadores y KPI</span>
          </li>
          <li onClick={() => setActiveComponent("ordenes")}>
            <FaClipboardList /><span>Mis Órdenes</span>
          </li>
        </ul>

        <footer>© 2025 RedNegocios</footer>
      </nav>

      {/* ---- contenido dinámico ---- */}
      <div className="admin-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default AdminHome;
