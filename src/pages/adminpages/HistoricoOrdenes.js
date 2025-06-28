import React, { useState, useEffect } from "react";
import ChatOrden from "../../componentes/mensajeria/ChatOrden";
import "./HistoricoOrdenes.css";

const HistoricoOrdenes = () => {
  /* ---------- state ---------- */
  const [negocios,       setNegocios]       = useState([]);
  const [selectedNegocio,setSelected]       = useState("");
  const [ordenes,        setOrdenes]        = useState([]);
  const [lineasOrden,    setLineas]         = useState([]);
  const [expandedOrder,  setExpanded]       = useState(null);
  const [loading,        setLoading]        = useState(false);

  /* paginación */
  const [page,           setPage]           = useState(0);
  const [pageSize,       setPageSize]       = useState(10);
  const [totalPages,     setTotalPages]     = useState(0);

  /* ---------- cargar negocios ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/negocios/api/negocios/admin-negocios",
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
        if (res.ok) setNegocios(await res.json());
        else alert("Error al cargar los negocios");
      } catch (e) { console.error(e); alert("Error de conexión"); }
    })();
  }, []);

  /* ---------- cargar historial ---------- */
  const fetchOrdenes = async (p = 0, size = pageSize) => {
    if (!selectedNegocio) return alert("Selecciona un negocio");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/ordenes/historico/${selectedNegocio}?page=${p}&size=${size}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (!res.ok) throw new Error("Error al cargar el historial");

      const body = await res.json();

      /* --- normalizar respuesta (Page<> o List<>) --- */
      let lista, tPages, isLast;
      if (Array.isArray(body)) {
        lista  = body;
        const hdrPages = res.headers.get("X-Total-Pages");
        if (hdrPages) {
          tPages = parseInt(hdrPages, 10);
          isLast = p >= tPages - 1;
        } else {
          isLast = lista.length < size;
          tPages = isLast ? p + 1 : p + 2;          // heurística
        }
      } else {
        lista  = body.content ?? [];
        tPages = body.totalPages ?? 1;
        isLast = body.last ?? (p >= tPages - 1);
      }

      setOrdenes(lista);
      setPage(p);
      setPageSize(size);
      setTotalPages(tPages);
      setExpanded(null);            // cierra cualquier detalle abierto
    } catch (e) { console.error(e); alert(e.message); }
    finally   { setLoading(false); }
  };

  /* ---------- detalle ---------- */
  const fetchDetalle = async (ordenId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/negocios/api/ordenes/detalle/${ordenId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (!res.ok) throw new Error("404");
      setLineas(await res.json());
      setExpanded(ordenId);
    } catch {
      setExpanded(null); setLineas([]);
      alert("No se pudo cargar el detalle");
    }
  };

  const toggleDetails = (id) => {
    if (expandedOrder === id) { setExpanded(null); return; }
    setLineas([]); setExpanded(null);
    fetchDetalle(id);
  };

  /* ---------- paginador ---------- */
  const Pagination = () => (
    totalPages > 0 && (
      <div className="pagination">

        <button disabled={page === 0}             onClick={() => fetchOrdenes(0)}>« Primera</button>
        <button disabled={page === 0}             onClick={() => fetchOrdenes(page - 1)}>&lt; Ant.</button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2)
          .map((i, idx, arr) => (
            <React.Fragment key={i}>
              {idx > 0 && i !== arr[idx - 1] + 1 && <span className="dots">…</span>}
              <button
                className={page === i ? "active" : ""}
                onClick={() => fetchOrdenes(i)}
              >{i + 1}</button>
            </React.Fragment>
          ))}

        <button disabled={page >= totalPages - 1} onClick={() => fetchOrdenes(page + 1)}>Sig. &gt;</button>
        <button disabled={page >= totalPages - 1} onClick={() => fetchOrdenes(totalPages - 1)}>Últ. »</button>

        <select value={pageSize} onChange={e => fetchOrdenes(0, parseInt(e.target.value, 10))}>
          {[10, 25, 50].map(s => <option key={s} value={s}>{s} / pág.</option>)}
        </select>
      </div>
    )
  );

  /* ---------- render ---------- */
  return (
    <div className="historico-ordenes-container">
      <h2>Histórico de Órdenes</h2>

      {/* selector negocio */}
      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">-- Selecciona un negocio --</option>
          {negocios.map(n => (
            <option key={n.negocioId} value={n.negocioId}>{n.nombre}</option>
          ))}
        </select>
        <button onClick={() => fetchOrdenes(0)} disabled={loading}>
          {loading ? "Cargando…" : "Ver historial"}
        </button>
      </div>

      {/* tabla */}
      {ordenes.length > 0 ? (
        <>
          <table className="ordenes-table">
            <thead>
              <tr><th>Número</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Detalles</th></tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <React.Fragment key={o.ordenId}>
                  <tr>
                    <td>{o.numeroOrden ?? o.ordenId}</td>
                    <td>{new Date(o.fechaOrden).toLocaleString()}</td>
                    <td>${o.montoTotal.toFixed(2)}</td>
                    <td>{o.estado}</td>
                    <td>
                      <button onClick={() => toggleDetails(o.ordenId)}>
                        {expandedOrder === o.ordenId ? "Ocultar" : "Ver"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrder === o.ordenId && (
                    <tr><td colSpan="5">
                      <div className="lineas-orden-container">
                        <h4>Detalles de la orden</h4>
                        <table className="lineas-orden-table">
                          <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                          <tbody>
                            {lineasOrden.map(l => (
                              <tr key={l.lineaOrdenId}>
                                <td>{l.negocioProducto.producto.nombre}</td>
                                <td>{l.cantidad}</td>
                                <td>${l.precioUnitario.toFixed(2)}</td>
                                <td>${(l.cantidad * l.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <ChatOrden ordenId={o.ordenId} emisorNegocioId={selectedNegocio} />
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <Pagination />
        </>
      ) : !loading && <p>No hay órdenes.</p>}
    </div>
  );
};

export default HistoricoOrdenes;
