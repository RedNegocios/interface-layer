import React, { useEffect, useState } from "react";
import "./SolicitudSuscripcionAdmin.css";

const SolicitudSuscripcionAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSolicitudes = async (p = 0, s = size) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/negocios/api/negocios/admin/solicitudes?page=${p}&size=${s}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar solicitudes");

      const body = await res.json();
      setSolicitudes(body.content ?? []);
      setPage(body.page ?? 0);
      setSize(body.size ?? s);
      setTotalPages(body.totalPages ?? 1);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleUpdate = async (usuarioNegocioId, nuevoEstatus) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/negocios/api/usuario-negocio/${usuarioNegocioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ estatusId: nuevoEstatus }),
      });

      if (response.ok) {
        alert("Estatus actualizado correctamente.");
        fetchSolicitudes(page);
      } else {
        alert("Error al actualizar el estatus.");
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const Pagination = () => (
    <div className="pagination">
      <button disabled={page === 0} onClick={() => fetchSolicitudes(0)}>« Primera</button>
      <button disabled={page === 0} onClick={() => fetchSolicitudes(page - 1)}>‹ Anterior</button>

      {Array.from({ length: totalPages }, (_, i) => i)
        .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2)
        .map((i, idx, arr) => (
          <React.Fragment key={i}>
            {idx > 0 && i !== arr[idx - 1] + 1 && <span className="dots">…</span>}
            <button
              className={i === page ? "active" : ""}
              onClick={() => fetchSolicitudes(i)}
            >
              {i + 1}
            </button>
          </React.Fragment>
        ))}

      <button disabled={page >= totalPages - 1} onClick={() => fetchSolicitudes(page + 1)}>Siguiente ›</button>
      <button disabled={page >= totalPages - 1} onClick={() => fetchSolicitudes(totalPages - 1)}>Última »</button>

      <select value={size} onChange={e => fetchSolicitudes(0, parseInt(e.target.value, 10))}>
        {[5, 10, 25, 50].map(v => <option key={v} value={v}>{v} / pág.</option>)}
      </select>
    </div>
  );

  return (
    <div className="solicitud-suscripcion-admin-container">
      <h2>Solicitudes de Suscripción</h2>

      {loading ? (
        <p>Cargando…</p>
      ) : solicitudes.length === 0 ? (
        <p className="mensaje-vacio">No hay solicitudes pendientes.</p>
      ) : (
        <>
          <table className="tabla-solicitudes">
            <thead>
              <tr>
                <th>Negocio</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.usuarioNegocioId}>
                  <td>{s.negocioNombre}</td>
                  <td>{s.username}</td>
                  <td>{s.email}</td>
                  <td className="acciones-tabla">
                    <button onClick={() => handleUpdate(s.usuarioNegocioId, 2)} disabled={loading}>Aprobar</button>
                    <button onClick={() => handleUpdate(s.usuarioNegocioId, 3)} disabled={loading}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default SolicitudSuscripcionAdmin;
