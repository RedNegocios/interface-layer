// src/pages/adminpages/GraficaKPIIngresos.js
import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./GraficaKPI.css";

/* ───────────────── helpers ─────────────────── */
const addDays = (date, n = 1) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const GraficaKPIIngresos = () => {
  const [negocios, setNegocios] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [tipo, setTipo] = useState("dia");             // ⬅ selector “día / mes / año”
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ──────────── cargar negocios ──────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/negocios/api/usuario-negocio/mis-negocios",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );
        if (res.ok) {
          setNegocios(await res.json());
        } else {
          alert("Error al cargar negocios");
        }
      } catch {
        alert("Error de conexión al cargar negocios");
      }
    })();
  }, []);

  /* ──────────── obtener datos del API ──────────── */
  const fetchDatosIngresos = async () => {
    if (!selectedNegocio || !fechaInicio || !fechaFin) {
      return alert("Completa negocio y rango de fechas");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/negocios/api/kpi/ingresos/por-periodo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            negocioId: parseInt(selectedNegocio),
            tipo,                // día | mes | anio
            fechaInicio,
            fechaFin,
          }),
        }
      );

      if (res.ok) {
        const raw = await res.json();

        /* ─── mapa fecha-clave → total ─── */
        const mapTotales = new Map(
          raw.map((d) => {
            const y = d.anio;
            const m = String(d.mes ?? 1).padStart(2, "0");
            const dd = String(d.dia ?? 1).padStart(2, "0");
            return [`${y}-${m}-${dd}`, d.total];
          })
        );

        /* ─── construir serie continua (sólo para ‘día’) ─── */
        let serie = [];
        if (tipo === "dia") {
          for (let d = new Date(fechaInicio); d <= new Date(fechaFin); d = addDays(d)) {
            const key = d.toISOString().slice(0, 10);
            serie.push({
              fecha: key.split("-").reverse().join("/"),
              total: mapTotales.get(key) ?? 0,
            });
          }
        } else {
          // mes: usamos yyyy-MM | año: yyyy
          serie = raw.map((d) => ({
            fecha:
              tipo === "mes"
                ? `${String(d.mes).padStart(2, "0")}/${d.anio}`
                : `${d.anio}`,
            total: d.total,
          }));
        }
        setDatos(serie);
      } else {
        alert("Error al obtener datos de ingresos");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────────── UI ───────────────────── */
  return (
    <div className="grafica-kpi-container">
      <h2>Ingresos por Periodo</h2>

      <div className="grafica-kpi-filtros">
        <label>Negocio:</label>
        <select value={selectedNegocio} onChange={(e) => setSelectedNegocio(e.target.value)}>
          <option value="">-- Selecciona --</option>
          {negocios.map((n) => (
            <option key={n.negocioId} value={n.negocioId}>
              {n.nombre}
            </option>
          ))}
        </select>

        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="dia">Día</option>
          <option value="mes">Mes</option>
          <option value="anio">Año</option>
        </select>

        <label>Fecha Inicio:</label>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

        <label>Fecha Fin:</label>
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

        <button onClick={fetchDatosIngresos} disabled={loading}>
          {loading ? "Cargando..." : "Generar Gráfica"}
        </button>
      </div>

      {datos.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fecha"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={tipo === "dia" ? 6 : 0}
            />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="total" data={datos} fill="#8884d8" shape="circle" line />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficaKPIIngresos;

