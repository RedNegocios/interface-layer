import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import "./AdminHome_debug.css";
import logo from "../assets/logo.png";

import {
  FaBars,
  FaTimes,
  FaStore,
  FaPlusSquare,
  FaBoxes,
  FaClipboardList,
  FaShoppingCart,
  FaHistory,
  FaChartBar,
  FaChevronDown,
} from "react-icons/fa";

const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [openSections, setOpenSections] = useState({
    negocio: true,
    productos: false,
    ordenes: false,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar localStorage o sessionStorage si hay tokens/sesión
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir a la página de login
    navigate("/");
  };

  const handleButtonClick = (component) => {
    console.log("Botón clickeado:", component);
    setActiveComponent(component);
    setDrawer(false);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
          <div className="hero-admin">
            <div className="hero-content animate-fade-in">
              <div className="hero-badge">
                <span className="pulse-dot"></span>
                Sistema Activo
              </div>

              <h1 className="hero-title">
                <span className="title-gradient">Panel de Control</span>
                <span className="title-sub">Administra tu negocio</span>
              </h1>

              <p className="hero-description">
                Controla cada aspecto de tu negocio desde un solo lugar.
                Gestiona productos, órdenes, clientes y mucho más.
              </p>

              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaStore />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">12</div>
                    <div className="stat-label">Productos</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">45</div>
                    <div className="stat-label">Órdenes</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaChartBar />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Eficiencia</div>
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className="primary-action-btn"
                  onClick={() => setDrawer(true)}
                >
                  <FaBars />
                  <span>Abrir Panel</span>
                  <div className="btn-glow"></div>
                </button>

                <button
                  className="secondary-action-btn"
                  onClick={() => setActiveComponent("resumen-kpi")}
                >
                  <FaChartBar />
                  Ver Estadísticas
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="floating-dashboard">
                <div
                  className="dashboard-card card-1"
                  /* onClick={() => setActiveComponent("crud-productos-negocios")} */
                >
                  <FaStore />
                  <span>Productos</span>
                </div>
                <div
                  className="dashboard-card card-2"
                  /* onClick={() => setActiveComponent("aceptar-ordenes")} */
                >
                  <FaShoppingCart />
                  <span>Órdenes</span>
                </div>
                <div
                  className="dashboard-card card-3"
                  onClick={() => setActiveComponent("resumen-kpi")}
                >
                  <FaChartBar />
                  <span>Analytics</span>
                </div>
                <div
                  className="dashboard-card card-4"
                  /* onClick={() => setActiveComponent("historico-ordenes")} */
                >
                  <FaClipboardList />
                  <span>Reportes</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-home-container">
      {/* Header profesional */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="header-left">
            <div className="admin-logo">
              <div className="logo-icon">
                <FaStore />
              </div>
              <div className="logo-text">
                <span className="brand-name">CoNetIng</span>
                <span className="brand-subtitle">Panel Admin</span>
              </div>
            </div>
          </div>

          <div className="header-center">
            <div className="breadcrumb">
              <FaStore />
              <span>Dashboard</span>
            </div>
          </div>

          <div className="header-right">
            <div className="admin-user-info">
              <div className="user-avatar">
                <span>A</span>
              </div>
              <div className="user-details">
                <span className="user-name">Administrador</span>
                <span className="user-role">Super Admin</span>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Botón de menú flotante */}
      <button className="menu-toggle" onClick={() => setDrawer(true)}>
        <div className="menu-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="menu-pulse"></div>
      </button>

      {/* Contenido principal */}
      <main className="main-content">{renderActiveComponent()}</main>

      {/* Drawer lateral */}
      <div className={`drawer ${drawer ? "open" : ""}`}>
        <button className="close-button" onClick={() => setDrawer(false)}>
          <FaTimes />
        </button>

        <div className="drawer-header">
          <h3 className="drawer-title">Panel de Administración</h3>
          <p className="drawer-subtitle">Gestiona tu negocio</p>
        </div>

        <nav className="drawer-nav">
          <div className="drawer-section">
            <button
              className={`drawer-section-title ${openSections.negocio ? "active" : ""}`}
              onClick={() => toggleSection("negocio")}
            >
              <span>Negocio</span>
              <FaChevronDown
                className={`section-icon ${openSections.negocio ? "rotated" : ""}`}
              />
            </button>
            <div
              className={`drawer-section-content ${openSections.negocio ? "open" : ""}`}
            >
              <button
                className={`drawer-button ${activeComponent === "solicitud-suscripcion-admin" ? "active" : ""}`}
                onClick={() => handleButtonClick("solicitud-suscripcion-admin")}
              >
                <span className="drawer-button-icon">
                  <FaStore />
                </span>
                <span className="drawer-button-text">
                  Solicitud de Suscripción
                </span>
              </button>
              <button
                className={`drawer-button ${activeComponent === "resumen-kpi" ? "active" : ""}`}
                onClick={() => handleButtonClick("resumen-kpi")}
              >
                <span className="drawer-button-icon">
                  <FaChartBar />
                </span>
                <span className="drawer-button-text">Indicadores y KPI</span>
              </button>
            </div>
          </div>

          {/* <div className="drawer-section">
            <button 
              className={`drawer-section-title ${openSections.productos ? 'active' : ''}`}
              onClick={() => toggleSection('productos')}
            >
              <span>Productos</span>
              <FaChevronDown className={`section-icon ${openSections.productos ? 'rotated' : ''}`} />
            </button>
            <div className={`drawer-section-content ${openSections.productos ? 'open' : ''}`}>
              <button
                className={`drawer-button ${activeComponent === 'crear-producto-nuevo' ? 'active' : ''}`}
                onClick={() => handleButtonClick('crear-producto-nuevo')}
              >
                <span className="drawer-button-icon"><FaBoxes /></span>
                <span className="drawer-button-text">Crear Producto Nuevo</span>
              </button>
              <button
                className={`drawer-button ${activeComponent === 'crear-producto-de-existente' ? 'active' : ''}`}
                onClick={() => handleButtonClick('crear-producto-de-existente')}
              >
                <span className="drawer-button-icon"><FaPlusSquare /></span>
                <span className="drawer-button-text">Añadir Producto Existente</span>
              </button>
              <button
                className={`drawer-button ${activeComponent === 'crud-productos-negocios' ? 'active' : ''}`}
                onClick={() => handleButtonClick('crud-productos-negocios')}
              >
                <span className="drawer-button-icon"><FaClipboardList /></span>
                <span className="drawer-button-text">Gestión de Productos</span>
              </button>
            </div>
          </div> */}

          {/* <div className="drawer-section">
            <button 
              className={`drawer-section-title ${openSections.ordenes ? 'active' : ''}`}
              onClick={() => toggleSection('ordenes')}
            >
              <span>Órdenes</span>
              <FaChevronDown className={`section-icon ${openSections.ordenes ? 'rotated' : ''}`} />
            </button>
            <div className={`drawer-section-content ${openSections.ordenes ? 'open' : ''}`}>
              <button
                className={`drawer-button ${activeComponent === 'crear-orden' ? 'active' : ''}`}
                onClick={() => handleButtonClick('crear-orden')}
              >
                <span className="drawer-button-icon"><FaShoppingCart /></span>
                <span className="drawer-button-text">Crear Orden</span>
              </button>
              <button
                className={`drawer-button ${activeComponent === 'aceptar-ordenes' ? 'active' : ''}`}
                onClick={() => handleButtonClick('aceptar-ordenes')}
              >
                <span className="drawer-button-icon"><FaShoppingCart /></span>
                <span className="drawer-button-text">Órdenes Pendientes</span>
              </button>
              <button
                className={`drawer-button ${activeComponent === 'historico-ordenes' ? 'active' : ''}`}
                onClick={() => handleButtonClick('historico-ordenes')}
              >
                <span className="drawer-button-icon"><FaHistory /></span>
                <span className="drawer-button-text">Historial de Órdenes</span>
              </button>
              <button
                className={`drawer-button ${activeComponent === 'ordenes' ? 'active' : ''}`}
                onClick={() => handleButtonClick('ordenes')}
              >
                <span className="drawer-button-icon"><FaClipboardList /></span>
                <span className="drawer-button-text">Mis Órdenes</span>
              </button>
            </div>
          </div> */}
        </nav>
      </div>

      {/* Overlay para cerrar drawer */}
      <div
        className={`overlay ${drawer ? "open" : ""}`}
        onClick={() => setDrawer(false)}
      ></div>
    </div>
  );
};

export default AdminHome;
