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

      const data = await res.json();               // ← List<Orden>
      const totalPages = res.headers.get("X-Total-Pages");
      const totalElems = res.headers.get("X-Total-Elements");

      setOrdenes(data);
      setPage(p);
      setSize(s);
      /* si el backend no manda cabeceras, deducimos */
      setPages(
        totalPages ? parseInt(totalPages, 10) :
        totalElems ? Math.ceil(parseInt(totalElems, 10) / s) :
        data.length < s ? p + 1 : p + 2
      );
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
      <div className="pagination">
        <button disabled={page === 0}             onClick={() => fetchOrdenes(0)}          >« Primera</button>
        <button disabled={page === 0}             onClick={() => fetchOrdenes(page - 1)}   >&lt; Ant.</button>

        {Array.from({ length: pages }, (_, i) => i)
          .filter(i => i === 0 || i === pages - 1 || Math.abs(i - page) <= 2)
          .map((i, idx, arr) => (
            <React.Fragment key={i}>
              {idx > 0 && i !== arr[idx - 1] + 1 && <span className="dots">…</span>}
              <button
                className={page === i ? "active" : ""}
                onClick={() => fetchOrdenes(i)}
              >{i + 1}</button>
            </React.Fragment>
          ))}

        <button disabled={page >= pages - 1} onClick={() => fetchOrdenes(page + 1)}>Sig. &gt;</button>
        <button disabled={page >= pages - 1} onClick={() => fetchOrdenes(pages - 1)}>Últ. »</button>

        <select value={size} onChange={e => fetchOrdenes(0, parseInt(e.target.value, 10))}>
          {[10, 25, 50].map(v => <option key={v} value={v}>{v} / pág.</option>)}
        </select>
      </div>
    )
  );

  /* ---------- render ---------- */
  return (
    <div className="ordenes-container">
      <h2>Mis Órdenes</h2>

      {loading ? (
        <p>Cargando…</p>
      ) : ordenes.length === 0 ? (
        <p>No has creado ninguna orden.</p>
      ) : (
        <>
          <table className="ordenes-table">
            <thead>
              <tr><th>Número</th><th>Negocio</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Detalles</th></tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <React.Fragment key={o.ordenId}>
                  <tr>
                    <td>{o.numeroOrden}</td>
                    <td>{o.negocio.nombre}</td>
                    <td>{new Date(o.fechaOrden).toLocaleString()}</td>
                    <td>${o.montoTotal.toFixed(2)}</td>
                    <td>{o.estado}</td>
                    <td>
                      <button onClick={() => toggle(o.ordenId)}>
                        {expanded === o.ordenId ? "Ocultar" : "Ver"}
                      </button>
                    </td>
                  </tr>

                  {expanded === o.ordenId && (
                    <tr><td colSpan="6">
                      <div className="lineas-orden-container">
                        <h4>Detalles de la orden</h4>
                        <table className="lineas-orden-table">
                          <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                          <tbody>
                            {o.lineasOrden.map(l => (
                              <tr key={l.lineaOrdenId}>
                                <td>{l.negocioProducto.producto.nombre}</td>
                                <td>{l.cantidad}</td>
                                <td>${l.precioUnitario.toFixed(2)}</td>
                                <td>${(l.cantidad * l.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <ChatOrden ordenId={o.ordenId} emisorUsuarioId={userId} />
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default MisOrdenes;
