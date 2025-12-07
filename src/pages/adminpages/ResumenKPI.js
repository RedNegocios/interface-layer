import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from "recharts";
import { 
  FaChartLine, FaLongArrowAltUp, FaLongArrowAltDown, FaUsers, FaShoppingCart, 
  FaDollarSign, FaPercent, FaEye, FaHandshake, FaFilter, FaCalendarAlt,
  FaArrowUp, FaArrowDown, FaEquals, FaSpinner
} from "react-icons/fa";
import "./ResumenKPI.css";

const ResumenKPI = () => {
  // Estados principales
  const [negocios, setNegocios] = useState([]);
  const [selectedNegocios, setSelectedNegocios] = useState([1, 2]); // IDs por defecto
  const [loading, setLoading] = useState(false);
  
  // Estados para datos de KPI
  const [ventasTendencia, setVentasTendencia] = useState(null);
  const [ventasEstadisticas, setVentasEstadisticas] = useState(null);
  
  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-12-31');
  const [periodo, setPeriodo] = useState('MENSUAL');
  const [activeTab, setActiveTab] = useState('ventas');

  // Colores para gráficas
  const COLORS = ['#2F2F2F', '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#fd7e14'];

  useEffect(() => {
    // Cargar negocios disponibles al inicio
    fetchNegocios();
  }, []);

  useEffect(() => {
    // Cargar datos KPI cuando cambien los filtros
    if (selectedNegocios.length > 0) {
      loadAllKPIData();
    }
  }, [selectedNegocios, fechaInicio, fechaFin, periodo]);

  // Generar datos derivados cuando se cargan los datos de ventas
  useEffect(() => {
    if (ventasTendencia && ventasTendencia.ventasTotales && ventasTendencia.ventasTotales.length > 0) {
      console.log('🔄 Generando datos derivados automáticamente...');
      generateDerivedData(ventasTendencia);
    }
  }, [ventasTendencia]);

  const fetchNegocios = async () => {
    try {
      const response = await fetch('http://localhost:8080/negocios/api/negocios/lista', {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setNegocios(data);
        // Seleccionar el primer negocio por defecto si no hay ninguno seleccionado
        if (data.length > 0 && selectedNegocios.length === 0) {
          setSelectedNegocios([data[0].negocioId]);
        }
      } else {
        console.error('Error fetching negocios:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching negocios:', error);
    }
  };

  const loadAllKPIData = async () => {
    setLoading(true);
    console.log('🔄 Cargando datos de ventas...', {
      selectedNegocios,
      fechaInicio,
      fechaFin,
      periodo
    });
    
    try {
      // Limpiar datos anteriores
      setVentasTendencia(null);
      setVentasEstadisticas(null);

      // Solo cargar ventas tendencia (endpoint real)
      await fetchVentasTendencia();
      
      console.log('✅ Datos de ventas cargados');
    } catch (error) {
      console.error('❌ Error loading ventas data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    console.log('🔑 Auth token:', token ? 'Token disponible' : 'Token NO encontrado');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchVentasTendencia = async () => {
    try {
      console.log('📊 Fetching ventas tendencia...');
      const response = await fetch('http://localhost:8080/negocios/api/analytics/ventas-tendencia', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          negocioIds: selectedNegocios,
          fechaInicio,
          fechaFin,
          periodo
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Ventas tendencia data:', data);
        setVentasTendencia(data);
      } else {
        console.error('❌ Error in ventas tendencia:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching ventas tendencia:', error);
    }
  };

  // Generar datos derivados del endpoint principal
  const generateDerivedData = (ventasData) => {
    if (!ventasData || !ventasData.ventasTotales) return;

    console.log('🔄 Generando datos derivados desde ventas tendencia...');

    // Generar estadísticas avanzadas de ventas
    const { ventasTotales, cantidadOrdenes, ticketPromedio } = ventasData;
    
    // Función para calcular estadísticas descriptivas
    const calcularEstadisticas = (data) => {
      const sorted = [...data].sort((a, b) => a - b);
      const n = sorted.length;
      
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const median = n % 2 === 0 ? 
        (sorted[n/2 - 1] + sorted[n/2]) / 2 : 
        sorted[Math.floor(n/2)];
      
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      
      return {
        mean: Math.round(mean),
        median: Math.round(median),
        stdDev: Math.round(stdDev),
        min: sorted[0],
        max: sorted[n-1],
        q1: Math.round(q1),
        q3: Math.round(q3),
        iqr: Math.round(iqr),
        data: sorted
      };
    };
    
    // Generar estadísticas para cada métrica
    const estadisticas = {
      ventas: calcularEstadisticas(ventasTotales),
      ordenes: calcularEstadisticas(cantidadOrdenes),
      tickets: calcularEstadisticas(ticketPromedio),
      
      // Datos para histogramas (distribución de frecuencias)
      histogramData: ventasTotales.map((venta, index) => ({
        periodo: ventasData.periodos[index],
        ventas: venta,
        ordenes: cantidadOrdenes[index],
        ticket: ticketPromedio[index],
        ventasBin: Math.floor(venta / 25000) * 25000,
        ordenesBin: Math.floor(cantidadOrdenes[index] / 10) * 10,
        ticketBin: Math.floor(ticketPromedio[index] / 500) * 500
      })),
      
      // Datos para boxplots
      boxplotData: [
        { 
          name: 'Ventas Totales', 
          data: ventasTotales,
          stats: calcularEstadisticas(ventasTotales)
        },
        { 
          name: 'Cantidad Órdenes', 
          data: cantidadOrdenes,
          stats: calcularEstadisticas(cantidadOrdenes)
        },
        { 
          name: 'Ticket Promedio', 
          data: ticketPromedio,
          stats: calcularEstadisticas(ticketPromedio)
        }
      ]
    };

    // Asignar estadísticas generadas
    setVentasEstadisticas(estadisticas);
    
    console.log('✅ Estadísticas avanzadas de ventas generadas:', estadisticas);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value || 0);
  };

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <FaArrowUp className="trend-up" />;
    if (value < 0) return <FaArrowDown className="trend-down" />;
    return <FaEquals className="trend-neutral" />;
  };

  return (
    <div className="dashboard-kpi-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-info">
          <h1 className="dashboard-title">
            <FaChartLine className="title-icon" />
            Analytics Dashboard
          </h1>
          <p className="dashboard-subtitle">Análisis avanzado de rendimiento y KPIs</p>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <FaSpinner className="spinning" />
            <span>Actualizando datos...</span>
          </div>
        )}
      </div>

      {/* Panel de Filtros */}
      <div className="filters-panel">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <div className="input-group">
            <label>Negocios</label>
            <div className="business-selector">
              {negocios.map(negocio => (
                <label key={negocio.negocioId} className="business-checkbox">
                  <input
                    type="checkbox"
                    value={negocio.negocioId}
                    checked={selectedNegocios.includes(negocio.negocioId)}
                    onChange={(e) => {
                      const negocioId = parseInt(e.target.value);
                      if (e.target.checked) {
                        setSelectedNegocios([...selectedNegocios, negocioId]);
                      } else {
                        setSelectedNegocios(selectedNegocios.filter(id => id !== negocioId));
                      }
                    }}
                  />
                  <span className="checkmark"></span>
                  {negocio.nombre}
                </label>
              ))}
            </div>
            <small className="help-text">
              {selectedNegocios.length} negocio(s) seleccionado(s)
            </small>
          </div>
        </div>

        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <div className="date-inputs">
            <div className="input-group">
              <label>Desde</label>
              <input 
                type="date" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="input-group">
              <label>Hasta</label>
              <input 
                type="date" 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>

        <div className="filter-group">
          <div className="input-group">
            <label>Período</label>
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="period-select"
            >
              <option value="DIARIO">Diario</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSUAL">Mensual</option>
              <option value="ANUAL">Anual</option>
            </select>
          </div>
        </div>

        <button 
          className="refresh-btn"
          onClick={loadAllKPIData}
          disabled={loading || selectedNegocios.length === 0}
        >
          {loading ? (
            <FaSpinner className="spinning" />
          ) : (
            <FaLongArrowAltUp />
          )}
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Título de sección */}
      <div className="section-header">
        <h2><FaChartLine /> Análisis Estadístico de Ventas</h2>
        <p>Visualizaciones avanzadas y estadísticas descriptivas de los datos de ventas</p>
      </div>

      {/* Dashboard de Estadísticas Avanzadas */}
      {ventasTendencia && ventasEstadisticas && (
        <div className="dashboard-content">
          {/* Estadísticas Descriptivas */}
          <div className="statistics-section">
            <h3><FaChartLine /> Estadísticas Descriptivas</h3>
            <div className="stats-cards-grid">
              <div className="stats-card">
                <h4><FaDollarSign /> Ventas Totales</h4>
                <div className="stats-details">
                  <div className="stat-row">
                    <span>Promedio:</span>
                    <span>{formatCurrency(ventasEstadisticas.ventas.mean)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Mediana:</span>
                    <span>{formatCurrency(ventasEstadisticas.ventas.median)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Desv. Estándar:</span>
                    <span>{formatCurrency(ventasEstadisticas.ventas.stdDev)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Rango:</span>
                    <span>{formatCurrency(ventasEstadisticas.ventas.min)} - {formatCurrency(ventasEstadisticas.ventas.max)}</span>
                  </div>
                  <div className="stat-row">
                    <span>IQR:</span>
                    <span>{formatCurrency(ventasEstadisticas.ventas.iqr)}</span>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h4><FaShoppingCart /> Cantidad de Órdenes</h4>
                <div className="stats-details">
                  <div className="stat-row">
                    <span>Promedio:</span>
                    <span>{ventasEstadisticas.ordenes.mean.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span>Mediana:</span>
                    <span>{ventasEstadisticas.ordenes.median.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span>Desv. Estándar:</span>
                    <span>{ventasEstadisticas.ordenes.stdDev.toLocaleString()}</span>
                  </div>
                  <div className="stat-row">
                    <span>Rango:</span>
                    <span>{ventasEstadisticas.ordenes.min} - {ventasEstadisticas.ordenes.max}</span>
                  </div>
                  <div className="stat-row">
                    <span>IQR:</span>
                    <span>{ventasEstadisticas.ordenes.iqr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h4><FaPercent /> Ticket Promedio</h4>
                <div className="stats-details">
                  <div className="stat-row">
                    <span>Promedio:</span>
                    <span>{formatCurrency(ventasEstadisticas.tickets.mean)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Mediana:</span>
                    <span>{formatCurrency(ventasEstadisticas.tickets.median)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Desv. Estándar:</span>
                    <span>{formatCurrency(ventasEstadisticas.tickets.stdDev)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Rango:</span>
                    <span>{formatCurrency(ventasEstadisticas.tickets.min)} - {formatCurrency(ventasEstadisticas.tickets.max)}</span>
                  </div>
                  <div className="stat-row">
                    <span>IQR:</span>
                    <span>{formatCurrency(ventasEstadisticas.tickets.iqr)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tendencia Temporal */}
          <div className="chart-section">
            <div className="chart-header">
              <h3>Tendencia Temporal de Ventas</h3>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color ventas"></div>
                  <span>Ventas Totales</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color ordenes"></div>
                  <span>Cantidad Órdenes</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={ventasTendencia.periodos?.map((periodo, index) => ({
                periodo,
                ventas: ventasTendencia.ventasTotales?.[index] || 0,
                ordenes: ventasTendencia.cantidadOrdenes?.[index] || 0,
                ticketPromedio: ventasTendencia.ticketPromedio?.[index] || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="periodo" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'ventas' ? formatCurrency(value) : value.toLocaleString(),
                    name === 'ventas' ? 'Ventas' : name === 'ordenes' ? 'Órdenes' : 'Ticket Promedio'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#2F2F2F" 
                  fill="rgba(47, 47, 47, 0.1)"
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="ordenes" 
                  stroke="#007bff" 
                  fill="rgba(0, 123, 255, 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Boxplots */}
          <div className="boxplot-section">
            <h3>Distribución de Datos (Boxplots)</h3>
            <div className="boxplot-grid">
              {ventasEstadisticas.boxplotData.map((dataset, index) => (
                <div key={dataset.name} className="boxplot-card">
                  <h4>{dataset.name}</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={[{
                        name: dataset.name,
                        min: dataset.stats.min,
                        q1: dataset.stats.q1,
                        median: dataset.stats.median,
                        q3: dataset.stats.q3,
                        max: dataset.stats.max
                      }]}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip 
                        formatter={(value, name) => [
                          dataset.name.includes('Ventas') || dataset.name.includes('Ticket') ? 
                            formatCurrency(value) : value.toLocaleString(),
                          name
                        ]}
                      />
                      <Bar dataKey="min" fill="#ff6b6b" name="Mínimo" />
                      <Bar dataKey="q1" fill="#4ecdc4" name="Q1" />
                      <Bar dataKey="median" fill="#45b7d1" name="Mediana" />
                      <Bar dataKey="q3" fill="#f9ca24" name="Q3" />
                      <Bar dataKey="max" fill="#f0932b" name="Máximo" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>

          {/* Histogramas */}
          <div className="histogram-section">
            <h3>Distribución de Frecuencias (Histogramas)</h3>
            <div className="histogram-grid">
              <div className="histogram-card">
                <h4>Distribución de Ventas</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={ventasEstadisticas.histogramData.reduce((acc, item) => {
                      const bin = item.ventasBin;
                      const existing = acc.find(x => x.bin === bin);
                      if (existing) {
                        existing.count++;
                      } else {
                        acc.push({ bin, count: 1, label: `${formatCurrency(bin)} - ${formatCurrency(bin + 25000)}` });
                      }
                      return acc;
                    }, [])}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2F2F2F" name="Frecuencia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="histogram-card">
                <h4>Distribución de Órdenes</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={ventasEstadisticas.histogramData.reduce((acc, item) => {
                      const bin = item.ordenesBin;
                      const existing = acc.find(x => x.bin === bin);
                      if (existing) {
                        existing.count++;
                      } else {
                        acc.push({ bin, count: 1, label: `${bin} - ${bin + 10}` });
                      }
                      return acc;
                    }, [])}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#007bff" name="Frecuencia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="histogram-card">
                <h4>Distribución de Tickets</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={ventasEstadisticas.histogramData.reduce((acc, item) => {
                      const bin = item.ticketBin;
                      const existing = acc.find(x => x.bin === bin);
                      if (existing) {
                        existing.count++;
                      } else {
                        acc.push({ bin, count: 1, label: `${formatCurrency(bin)} - ${formatCurrency(bin + 500)}` });
                      }
                      return acc;
                    }, [])}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#28a745" name="Frecuencia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenKPI;
