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
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <div className="animate-fade-in">
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'var(--primary-100)',
                borderRadius: 'var(--border-radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
              }}>
                <FaBars style={{ fontSize: '32px', color: 'var(--primary-500)' }} />
              </div>
              <h2 style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-semibold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--space-4)'
              }}>
                Bienvenido al Panel de Administración
              </h2>
              <p style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--gray-600)',
                maxWidth: '500px',
                margin: '0 auto var(--space-8)',
                lineHeight: 1.6
              }}>
                Selecciona una opción del menú lateral para gestionar tu negocio, productos, órdenes y más.
              </p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => setDrawer(true)}
              >
                <FaBars />
                Abrir Menú
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header moderno fijo */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        zIndex: 'var(--z-fixed)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setDrawer(true)}
            style={{ borderRadius: 'var(--border-radius-md)' }}
          >
            <FaBars />
          </button>
          <img 
            src={logo} 
            alt="logo" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--border-radius-md)'
            }}
          />
          <h1 style={{ 
            fontSize: 'var(--text-xl)', 
            fontWeight: 'var(--font-semibold)', 
            color: 'var(--gray-900)',
            margin: 0
          }}>
            Panel Admin
          </h1>
        </div>
      </header>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-overlay)',
          zIndex: 'var(--z-modal-backdrop)',
          opacity: drawer ? 1 : 0,
          visibility: drawer ? 'visible' : 'hidden',
          transition: 'all var(--transition-normal)'
        }}
        onClick={() => setDrawer(false)}
      />

      {/* Drawer moderno */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '320px',
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--gray-200)',
        transform: drawer ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--transition-normal)',
        zIndex: 'var(--z-modal)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: 'var(--font-semibold)',
            color: 'var(--gray-900)',
            margin: 0
          }}>
            Menú Admin
          </h3>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setDrawer(false)}
            style={{ borderRadius: 'var(--border-radius-full)', width: '32px', height: '32px', padding: 0 }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {/* Navegación moderna con botones */}
            {[
              { key: "solicitud-suscripcion-admin", icon: FaStore, label: "Suscripciones a Negocios" },
              { key: "crear-producto-de-existente", icon: FaPlusSquare, label: "Añadir Producto Existente" },
              { key: "crear-producto-nuevo", icon: FaBoxes, label: "Crear Producto desde Cero" },
              { key: "crud-productos-negocios", icon: FaClipboardList, label: "Gestión de Productos" },
              { key: "crear-orden", icon: FaShoppingCart, label: "Crear Orden" },
              { key: "aceptar-ordenes", icon: FaShoppingCart, label: "Órdenes Pendientes" },
              { key: "historico-ordenes", icon: FaHistory, label: "Historial de Órdenes" },
              { key: "resumen-kpi", icon: FaChartBar, label: "Indicadores y KPI" },
              { key: "ordenes", icon: FaClipboardList, label: "Mis Órdenes" }
            ].map(({ key, icon: Icon, label }) => (
              <button 
                key={key}
                className={`btn ${activeComponent === key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  width: '100%', 
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--text-sm)'
                }}
                onClick={() => {
                  setActiveComponent(key);
                  setDrawer(false);
                }}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer del drawer */}
        <div style={{
          padding: 'var(--space-6)',
          borderTop: '1px solid var(--gray-200)',
          color: 'var(--gray-500)',
          fontSize: 'var(--text-sm)',
          textAlign: 'center'
        }}>
          © 2025 RedNegocios
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{
        marginTop: '70px',
        padding: 'var(--space-6)',
        minHeight: 'calc(100vh - 70px)'
      }}>
        <div className="animate-fade-in">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
