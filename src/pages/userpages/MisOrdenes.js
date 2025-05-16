import React, { useEffect, useState } from "react";
import ChatOrden from "../../componentes/mensajeria/ChatOrden";
import "./MisOrdenes.css";

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpanded] = useState(null);

  // ID del usuario logueado (convertido a entero)
  const currentUserId = parseInt(localStorage.getItem("userId"));
  console.log("currentUserId:", currentUserId, typeof currentUserId);

  /* --------- cargar órdenes del usuario --------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:8080/negocios/api/ordenes/mis-ordenes",
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setOrdenes(data);
          console.log("Órdenes cargadas:", data);
        } else {
          alert("Error al cargar las órdenes");
        }
      } catch (e) {
        console.error("Error al cargar órdenes:", e);
        alert("Error de conexión");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* --------- toggle expand --------- */
  const toggleDetails = (ordenId) => {
    console.log("Toggle orden:", ordenId);
    setExpanded(expandedOrder === ordenId ? null : ordenId);
  };

  /* --------- render --------- */
  return (
    <div className="ordenes-container">
      <h2>Mis Órdenes</h2>

      {loading ? (
        <p>Cargando…</p>
      ) : ordenes.length === 0 ? (
        <p>No has creado ninguna orden.</p>
      ) : (
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Negocio</th>
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
                  <td>{o.negocio.nombre}</td>
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
                    <td colSpan="6">
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
                            {o.lineasOrden.map((l) => (
                              <tr key={l.lineaOrdenId}>
                                <td>{l.negocioProducto.producto.nombre}</td>
                                <td>{l.cantidad}</td>
                                <td>${l.precioUnitario.toFixed(2)}</td>
                                <td>${(l.cantidad * l.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Chat (emisor = usuario) */}
                        {console.log("Renderizando ChatOrden con:", {
                          ordenId: o.ordenId,
                          emisorUsuarioId: currentUserId
                        })}
                        <ChatOrden
                          ordenId={o.ordenId}
                          emisorUsuarioId={currentUserId}
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
    </div>
  );
};

export default MisOrdenes;
