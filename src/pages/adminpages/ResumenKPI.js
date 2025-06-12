import React, { useEffect, useState } from "react";
import "./ResumenKPI.css";

const ResumenKPI = () => {
  const [negocios, setNegocios] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Paso 1: Obtener negocios del usuario autenticado
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/negocios/api/usuario-negocio/mis-negocios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setNegocios(data);
        } else {
          alert("Error al cargar los negocios.");
        }
      } catch (error) {
        console.error("Error al obtener negocios:", error);
        alert("Error de conexión.");
      }
    })();
  }, []);

  // Paso 2: Enviar el negocioId al endpoint KPI
  const fetchKPI = async () => {
    if (!selectedNegocio) return alert("Selecciona un negocio");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/negocios/api/kpi/global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ negocioId: parseInt(selectedNegocio) }),
      });

      if (res.ok) {
        const data = await res.json();
        setKpiData(data);
      } else {
        alert("Error al obtener KPIs.");
      }
    } catch (error) {
      console.error("Error al obtener KPIs:", error);
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resumen-kpi-container">
      <h2>Resumen KPI del Negocio</h2>

      {/* Selector de negocio */}
      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un negocio:</label>
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
        <button onClick={fetchKPI} disabled={loading}>
          {loading ? "Cargando..." : "Ver KPIs"}
        </button>
      </div>

      {/* KPIs */}
      {kpiData && (
        <>
          <div className="kpi-resumen-metricas">
            <div className="kpi-card">
              <h3>Ingresos Totales</h3>
              <p>${kpiData.kpiitresponse.ingresosTotales.toFixed(2)}</p>
            </div>
            <div className="kpi-card">
              <h3>Ganancia Neta</h3>
              <p>${kpiData.kpignresponse.gananciaNeta.toFixed(2)}</p>
            </div>
          </div>

          <h3>Top 10 Productos Más Vendidos</h3>
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Producto ID</th>
                <th>Nombre</th>
                <th>Total Vendido</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.listTopMasVendidos.map((producto) => (
                <tr key={producto.productoId}>
                  <td>{producto.productoId}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.totalVendida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ResumenKPI;

