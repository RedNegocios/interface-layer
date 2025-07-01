import React, { useState } from "react";
import {
  FaBars, FaTimes, FaUserPlus, FaShoppingCart, FaClipboardList
} from "react-icons/fa";

import SolicitudSuscripcion from "./userpages/SolicitudSuscripcion";
import CrearOrden           from "./userpages/CrearOrden";
import MisOrdenes           from "./userpages/MisOrdenes";

import "./UserHome.css";
import logo from "../assets/logo.png";

const UserHome = () => {
  const [active, setActive] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const choose = (view) => { setActive(view); setDrawer(false); };

  const render = () => {
    switch (active) {
      case "suscripcion": return <SolicitudSuscripcion />;
      case "nueva":       return <CrearOrden />;
      case "ordenes":     return <MisOrdenes />;
      default:
        return (
          <div className="mensaje-inicial">
            Bienvenido. Selecciona una opción para comenzar.
          </div>
        );
    }
  };

  return (
    <div className="user-layout">
      {/* ---- Top bar ---- */}
      <header className="topbar">
  <div className="topbar-left">
    <button className="hamburger" onClick={() => setDrawer(true)}>
      <FaBars />
    </button>
    <img src={logo} alt="logo" className="logo" />
  </div>

  <h1 className="admin-title">Panel del Usuario</h1>

  <div className="topbar-right"></div>
</header>


      {/* ---- Backdrop ---- */}
      <div className={`backdrop ${drawer ? "show" : ""}`} onClick={() => setDrawer(false)} />

      {/* ---- Drawer ---- */}
      <nav className={`drawer ${drawer ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setDrawer(false)}>
          <FaTimes />
        </button>

        <h3>Menú Usuario</h3>
       
<ul>
  <li onClick={() => { choose("suscripcion"); setDrawer(false); }}>
    <FaUserPlus /><span>Suscripción a Negocio</span>
  </li>
  <li onClick={() => { choose("nueva"); setDrawer(false); }}>
    <FaShoppingCart /><span>Hacer Nueva Orden</span>
  </li>
  <li onClick={() => { choose("ordenes"); setDrawer(false); }}>
    <FaClipboardList /><span>Mis Órdenes</span>
  </li>
</ul>


        <footer>© 2025 RedNegocios</footer>
      </nav>

      {/* ---- contenido dinámico ---- */}
      <div className="user-content">
        {render()}
      </div>
    </div>
  );
};

export default UserHome;
