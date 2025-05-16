import React, { useState, useEffect } from "react";
import ChatOrden from "../../componentes/mensajeria/ChatOrden";
import "./HistoricoOrdenes.css";

const HistoricoOrdenes = () => {
  /* --------- state --------- */
  const [negocios, setNegocios]       = useState([]);
  const [selectedNegocio, setSelected] = useState("");
  const [ordenes, setOrdenes]         = useState([]);
  const [expandedOrder, setExpanded]  = useState(null);
  const [lineasOrden, setLineas]      = useState([]);
  const [loading, setLoading]         = useState(false);

  /* --------- cargar negocios --------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/negocios/api/negocios/admin-negocios",
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
        if (res.ok) setNegocios(await res.json());
        else alert("Error al cargar los negocios");
      } catch (e) {
        console.error(e);
        alert("Error de conexión");
      }
    })();
  }, []);

  /* --------- cargar historial de órdenes --------- */
  const fetchOrdenes = async () => {
    if (!selectedNegocio) return alert("Selecciona un negocio");

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/ordenes/historico/${selectedNegocio}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (res.ok) setOrdenes(await res.json());
      else alert("Error al cargar el historial");
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  /* --------- cargar detalle de una orden --------- */
  const fetchDetalle = async (ordenId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/ordenes/detalle/${ordenId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (res.ok) {
        setLineas(await res.json());
        setExpanded(ordenId);
      } else alert("Error al cargar detalle");
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };

  /* --------- toggle expand --------- */
  const toggleDetails = (ordenId) =>
    expandedOrder === ordenId ? setExpanded(null) : fetchDetalle(ordenId);

  /* --------- render --------- */
  return (
    <div className="historico-ordenes-container">
      <h2>Histórico de Órdenes</h2>

      {/* Selector de negocio */}
      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Selecciona un negocio --</option>
          {negocios.map((n) => (
            <option key={n.negocioId} value={n.negocioId}>
              {n.nombre}
            </option>
          ))}
        </select>
        <button onClick={fetchOrdenes} disabled={loading}>
          {loading ? "Cargando…" : "Ver historial"}
        </button>
      </div>

      {/* Tabla de órdenes */}
      {ordenes.length > 0 && (
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <React.Fragment key={o.ordenId}>
                <tr>
                  <td>{o.numeroOrden}</td>
                  <td>{new Date(o.fechaOrden).toLocaleString()}</td>
                  <td>${o.montoTotal.toFixed(2)}</td>
                  <td>{o.estado}</td>
                  <td>
                    <button onClick={() => toggleDetails(o.ordenId)}>
                      {expandedOrder === o.ordenId ? "Ocultar" : "Ver"}
                    </button>
                  </td>
                </tr>

                {/* Fila expandida con detalle + chat */}
                {expandedOrder === o.ordenId && (
                  <tr>
                    <td colSpan="5">
                      <div className="lineas-orden-container">
                        <h4>Detalles de la orden</h4>
                        <table className="lineas-orden-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lineasOrden.map((l) => (
                              <tr key={l.lineaOrdenId}>
                                <td>{l.negocioProducto.producto.nombre}</td>
                                <td>{l.cantidad}</td>
                                <td>${l.precioUnitario.toFixed(2)}</td>
                                <td>${(l.cantidad * l.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Chat (emisor = negocio) */}
                        <ChatOrden
                          ordenId={o.ordenId}
                          emisorNegocioId={selectedNegocio}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {ordenes.length === 0 && !loading && <p>No hay órdenes.</p>}
    </div>
  );
};

export default HistoricoOrdenes;
