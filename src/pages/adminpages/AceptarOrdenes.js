import React, { useEffect, useState } from "react";
import "./AceptarOrdenes.css";

const AceptarOrdenes = () => {
  const [negocios, setNegocios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener negocios del administrador
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

  // Obtener órdenes del negocio seleccionado
  const fetchOrdenes = async (negocioId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/negocios/api/ordenes/por-negocio/${negocioId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

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

  // Manejar cambio de estado de una orden
  const actualizarEstadoOrden = async (ordenId, nuevoEstado) => {
    try {
      const response = await fetch(
        `http://localhost:8080/negocios/api/ordenes/actualizar-estado/${ordenId}?nuevoEstado=${nuevoEstado}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        alert(`Orden ${nuevoEstado.toLowerCase()} exitosamente.`);
        fetchOrdenes(selectedNegocio);
      } else {
        alert("Error al actualizar el estado de la orden.");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="aceptar-ordenes-container">
      <h2>Aceptar Órdenes</h2>

      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un Negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={(e) => {
            setSelectedNegocio(e.target.value);
            fetchOrdenes(e.target.value);
          }}
        >
          <option value="">-- Selecciona un negocio --</option>
          {negocios.map((negocio) => (
            <option key={negocio.negocioId} value={negocio.negocioId}>
              {negocio.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        ordenes.length > 0 && (
          <table className="ordenes-table">
            <thead>
              <tr>
                <th>Número de Orden</th>
                <th>Fecha</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.ordenId}>
                  <td>{orden.numeroOrden}</td>
                  <td>{new Date(orden.fechaOrden).toLocaleString()}</td>
                  <td>${orden.montoTotal.toFixed(2)}</td>
                  <td>{orden.estado}</td>
                  <td>
                    <button
                      onClick={() => actualizarEstadoOrden(orden.ordenId, "Aceptada")}
                      disabled={orden.estado !== "Pendiente"}
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => actualizarEstadoOrden(orden.ordenId, "Rechazada")}
                      disabled={orden.estado !== "Pendiente"}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default AceptarOrdenes;
