import React, { useState, useEffect } from "react";
import "./HistoricoOrdenes.css";

const HistoricoOrdenes = () => {
  const [negocios, setNegocios] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null); // To manage expanded orders
  const [lineasOrden, setLineasOrden] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const response = await fetch("http://localhost:8080/negocios/api/negocios/admin-negocios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNegocios(data);
        } else {
          alert("Error al cargar los negocios.");
        }
      } catch (error) {
        console.error("Error al obtener los negocios:", error);
        alert("Error al conectar con el servidor.");
      }
    };

    fetchNegocios();
  }, []);

  const fetchOrdenes = async () => {
    if (!selectedNegocio) {
      alert("Selecciona un negocio.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/negocios/api/ordenes/historico/${selectedNegocio}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrdenes(data);
      } else {
        alert("Error al cargar el historial de órdenes.");
      }
    } catch (error) {
      console.error("Error al obtener el historial de órdenes:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalleOrden = async (ordenId) => {
    try {
      const response = await fetch(`http://localhost:8080/negocios/api/ordenes/detalle/${ordenId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLineasOrden(data);
        setExpandedOrder(ordenId);
      } else {
        alert("Error al cargar los detalles de la orden.");
      }
    } catch (error) {
      console.error("Error al obtener los detalles de la orden:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const toggleOrderDetails = (ordenId) => {
    if (expandedOrder === ordenId) {
      setExpandedOrder(null);
      setLineasOrden([]);
    } else {
      fetchDetalleOrden(ordenId);
    }
  };

  return (
    <div className="historico-ordenes-container">
      <h2>Histórico de Órdenes</h2>

      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un Negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={(e) => setSelectedNegocio(e.target.value)}
        >
          <option value="">-- Selecciona un negocio --</option>
          {negocios.map((negocio) => (
            <option key={negocio.negocioId} value={negocio.negocioId}>
              {negocio.nombre}
            </option>
          ))}
        </select>
        <button onClick={fetchOrdenes} disabled={loading}>
          {loading ? "Cargando..." : "Ver Historial"}
        </button>
      </div>

      {ordenes.length > 0 && (
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Número de Orden</th>
              <th>Fecha</th>
              <th>Monto Total</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <React.Fragment key={orden.ordenId}>
                <tr>
                  <td>{orden.numeroOrden}</td>
                  <td>{new Date(orden.fechaOrden).toLocaleString()}</td>
                  <td>${orden.montoTotal.toFixed(2)}</td>
                  <td>{orden.estado}</td>
                  <td>
                    <button onClick={() => toggleOrderDetails(orden.ordenId)}>
                      {expandedOrder === orden.ordenId ? "Ocultar" : "Ver"}
                    </button>
                  </td>
                </tr>
                {expandedOrder === orden.ordenId && (
                  <tr>
                    <td colSpan="5">
                      <div className="lineas-orden-container">
                        <h4>Detalles de la Orden</h4>
                        <table className="lineas-orden-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio Unitario</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lineasOrden.map((linea) => (
                              <tr key={linea.lineaOrdenId}>
                                <td>{linea.negocioProducto.producto.nombre}</td>
                                <td>{linea.cantidad}</td>
                                <td>${linea.precioUnitario.toFixed(2)}</td>
                                <td>${(linea.cantidad * linea.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      {ordenes.length === 0 && !loading && <p>No hay órdenes para este negocio.</p>}
    </div>
  );
};

export default HistoricoOrdenes;
