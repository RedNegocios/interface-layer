import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./ResumenKPI.css";

const ResumenKPI = () => {
  const [negocios, setNegocios] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [graficaData, setGraficaData] = useState([]);
  const [tipoPeriodo, setTipoPeriodo] = useState("dia");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/negocios/api/usuario-negocio/mis-negocios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setNegocios(data);
      } catch (error) {
        console.error("Error al obtener negocios:", error);
        alert("Error al cargar los negocios.");
      }
    })();
  }, []);

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

  const fetchGrafica = async () => {
    if (!selectedNegocio || !fechaInicio || !fechaFin) {
      return alert("Selecciona un negocio y ambas fechas.");
    }

    try {
      const res = await fetch("http://localhost:8080/negocios/api/kpi/ingresos/por-periodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          negocioId: parseInt(selectedNegocio),
          tipo: tipoPeriodo,
          fechaInicio,
          fechaFin
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const transformado = data.map((d) => {
          let label = "";
          if (tipoPeriodo === "dia") {
            label = `${d.dia.toString().padStart(2, '0')}/${d.mes.toString().padStart(2, '0')}/${d.anio}`;
          } else if (tipoPeriodo === "mes") {
            label = `${d.mes.toString().padStart(2, '0')}/${d.anio}`;
          } else if (tipoPeriodo === "anio") {
            label = `${d.anio}`;
          }
          return {
            fecha: label,
            total: d.total
          };
        });
        setGraficaData(transformado);
      } else {
        alert("Error al obtener datos de la gráfica.");
      }
    } catch (error) {
      console.error("Error en gráfica:", error);
      alert("Error de conexión.");
    }
  };

  return (
    <div className="resumen-kpi-container">
      <h2>Resumen KPI del Negocio</h2>

      {/* Selector de negocio */}
      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un Negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={(e) => setSelectedNegocio(e.target.value)}
        >
          <option value="">-- Selecciona un Negocio --</option>
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

      {kpiData && (
        <>
          <div className="kpi-resumen-metricas">
            <div className="kpi-card">
              <h3>Ingresos Totales</h3>
              <p>${kpiData.kpiitresponse.ingresosTotales.toFixed(2)}</p>
            </div>
            {/*<div className="kpi-card">
              <h3>Ganancia Neta</h3>
              <p>${kpiData.kpignresponse.gananciaNeta.toFixed(2)}</p>
            </div>*/}
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

          {/* 📊 Nueva sección: Gráfica */}
          <div className="grafica-kpi-seccion">
            <h3>Ingresos por Periodo</h3>
            <div className="grafica-filtros">
              <label>Tipo:</label>
              <select value={tipoPeriodo} onChange={(e) => setTipoPeriodo(e.target.value)}>
                <option value="dia">Día</option>
                <option value="mes">Mes</option>
                <option value="anio">Año</option>
              </select>

              <label>Fecha Inicio:</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

              <label>Fecha Fin:</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

              <button onClick={fetchGrafica}>Generar Gráfica</button>
            </div>

            {graficaData.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graficaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResumenKPI;
