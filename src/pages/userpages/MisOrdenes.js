import React, { useEffect, useState } from "react";
import "./MisOrdenes.css";

const MisOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null); // Controla qué orden está expandida

  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/negocios/api/ordenes/mis-ordenes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrdenes(data);
        } else {
          alert("Error al cargar las órdenes.");
        }
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        alert("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const toggleOrderDetails = (ordenId) => {
    setExpandedOrder(expandedOrder === ordenId ? null : ordenId);
  };

  return (
    <div className="ordenes-container">
      <h2>Mis Órdenes</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : ordenes.length === 0 ? (
        <p>No has creado ninguna orden.</p>
      ) : (
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Número de Orden</th>
              <th>Negocio</th>
              <th>Fecha</th>
              <th>Monto Total</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <>
                <tr key={orden.ordenId}>
                  <td>{orden.numeroOrden}</td>
                  <td>{orden.negocio.nombre}</td>
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
                    <td colSpan="6">
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
                            {orden.lineasOrden.map((linea) => (
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
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MisOrdenes;

