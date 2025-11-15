import React, { useEffect, useState } from "react";
import ChatOrden from "../../componentes/mensajeria/ChatOrden";
import "./MisOrdenes.css";          // reutilizaremos la misma hoja

const MisOrdenes = () => {
  /* ---------- estado ---------- */
  const [ordenes,  setOrdenes]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [expanded, setExpanded] = useState(null);

  /* paginación */
  const [page,     setPage]     = useState(0);
  const [size,     setSize]     = useState(10);
  const [pages,    setPages]    = useState(0);   // totalPages

  const userId = parseInt(localStorage.getItem("userId"), 10);

  /* ---------- llamada al backend ---------- */
  const fetchOrdenes = async (p = 0, s = size) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/ordenes/mis-ordenes?page=${p}&size=${s}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (!res.ok) throw new Error("Error al cargar las órdenes");

      const data = await res.json();

      setOrdenes(Array.isArray(data.content) ? data.content : []);
      setPage(p);
      setSize(s);
      setPages(data.totalPages ?? 1); // usamos directamente lo que viene en el cuerpo
      setExpanded(null);
    } catch (e) {
      console.error(e); alert(e.message);
    } finally { setLoading(false); }
  };

  /* carga inicial */
  useEffect(() => { fetchOrdenes(0); }, []);

  /* ---------- helpers ---------- */
  const toggle = id => setExpanded(expanded === id ? null : id);

  const Pagination = () => (
    pages > 0 && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--gray-50)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--gray-200)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button 
            className="btn btn-sm btn-secondary" 
            disabled={page === 0} 
            onClick={() => fetchOrdenes(0)}
          >
            Primera
          </button>
          <button 
            className="btn btn-sm btn-secondary" 
            disabled={page === 0} 
            onClick={() => fetchOrdenes(page - 1)}
          >
            Anterior
          </button>

          {Array.from({ length: pages }, (_, i) => i)
            .filter(i => i === 0 || i === pages - 1 || Math.abs(i - page) <= 2)
            .map((i, idx, arr) => (
              <React.Fragment key={i}>
                {idx > 0 && i !== arr[idx - 1] + 1 && (
                  <span style={{ color: 'var(--gray-400)', padding: '0 var(--space-2)' }}>…</span>
                )}
                <button
                  className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => fetchOrdenes(i)}
                >
                  {i + 1}
                </button>
              </React.Fragment>
            ))}

          <button 
            className="btn btn-sm btn-secondary" 
            disabled={page >= pages - 1} 
            onClick={() => fetchOrdenes(page + 1)}
          >
            Siguiente
          </button>
          <button 
            className="btn btn-sm btn-secondary" 
            disabled={page >= pages - 1} 
            onClick={() => fetchOrdenes(pages - 1)}
          >
            Última
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>Mostrar:</span>
          <select 
            className="form-input" 
            style={{ width: 'auto', minWidth: '80px' }}
            value={size} 
            onChange={e => fetchOrdenes(0, parseInt(e.target.value, 10))}
          >
            {[10, 25, 50].map(v => <option key={v} value={v}>{v} por página</option>)}
          </select>
        </div>
      </div>
    )
  );

  /* ---------- render ---------- */
  return (
    <div className="container animate-fade-in">
      <div className="card">
        <div className="card-header">
          <h2 style={{ color: 'var(--gray-900)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)' }}>
            Mis Órdenes
          </h2>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12)' }}>
              <div className="spinner"></div>
              <span style={{ marginLeft: 'var(--space-3)', color: 'var(--gray-600)' }}>Cargando órdenes...</span>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="alert alert-warning">
              <p>No has creado ninguna orden aún.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
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
              {ordenes.map(o => (
                <React.Fragment key={o.ordenId}>
                  <tr>
                    <td style={{ fontWeight: 'var(--font-medium)' }}>#{o.numeroOrden}</td>
                    <td>{o.negocio.nombre}</td>
                    <td style={{ color: 'var(--gray-600)', fontSize: 'var(--text-sm)' }}>
                      {new Date(o.fechaOrden).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--success-600)' }}>
                      ${o.montoTotal.toFixed(2)}
                    </td>
                    <td>
                      <span style={{
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--border-radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-medium)',
                        backgroundColor: o.estado === 'COMPLETADA' ? 'var(--success-100)' : 
                                       o.estado === 'PENDIENTE' ? 'var(--warning-100)' : 
                                       o.estado === 'CANCELADA' ? 'var(--danger-100)' : 'var(--gray-100)',
                        color: o.estado === 'COMPLETADA' ? 'var(--success-700)' : 
                               o.estado === 'PENDIENTE' ? 'var(--warning-700)' : 
                               o.estado === 'CANCELADA' ? 'var(--danger-700)' : 'var(--gray-700)'
                      }}>
                        {o.estado}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn btn-sm ${expanded === o.ordenId ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggle(o.ordenId)}
                      >
                        {expanded === o.ordenId ? "Ocultar" : "Ver Detalles"}
                      </button>
                    </td>
                  </tr>

                  {expanded === o.ordenId && (
                    <tr><td colSpan="6" style={{ padding: 0 }}>
                      <div className="animate-slide-in" style={{
                        backgroundColor: 'var(--gray-50)',
                        padding: 'var(--space-6)',
                        borderTop: '1px solid var(--gray-200)'
                      }}>
                        <h4 style={{ 
                          color: 'var(--gray-800)', 
                          marginBottom: 'var(--space-4)',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-semibold)'
                        }}>
                          Detalles de la orden #{o.numeroOrden}
                        </h4>
                        
                        <div className="table-container" style={{ marginBottom: 'var(--space-6)' }}>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {o.lineasOrden.map(l => (
                                <tr key={l.lineaOrdenId}>
                                  <td style={{ fontWeight: 'var(--font-medium)' }}>
                                    {l.negocioProducto.producto.nombre}
                                  </td>
                                  <td>{l.cantidad}</td>
                                  <td>${l.precioUnitario.toFixed(2)}</td>
                                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--success-600)' }}>
                                    ${(l.cantidad * l.precioUnitario).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <ChatOrden ordenId={o.ordenId} emisorUsuarioId={userId} />
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Pagination />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisOrdenes;
