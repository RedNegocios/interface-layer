import React, { useEffect, useState } from "react";
import "./SolicitudSuscripcionAdmin.css";

const SolicitudSuscripcionAdmin = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener la lista de negocios y usuarios asociados
  const fetchNegocios = async () => {
    try {
      const response = await fetch("http://localhost:8080/negocios/api/negocios/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNegocios(data);
      } else {
        alert("Error al cargar la lista de negocios.");
      }
    } catch (error) {
      console.error("Error al obtener los negocios:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchNegocios();
  }, []);

  // Manejar la actualización del estatus de un usuario
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
        // Refrescar los datos después de actualizar el estatus
        await fetchNegocios(); // Vuelve a cargar los negocios
      } else {
        alert("Error al actualizar el estatus.");
      }
    } catch (error) {
      console.error("Error al actualizar el estatus:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitud-suscripcion-admin-container">
      <h2>Solicitudes de Suscripción</h2>
      {negocios.length === 0 ? (
        <p className="mensaje-vacio">No hay solicitudes pendientes.</p>

      ) : (
        negocios.map((negocio) => (
          <div key={negocio.negocioNombre} className="negocio-container">
            <h3>{negocio.negocioNombre}</h3>
            <ul>
              {negocio.usuarios.map((usuario) => (
                <li key={usuario.usuarioId} className="usuario-item">
                  <p>
                    <strong>Usuario:</strong> {usuario.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {usuario.email}
                  </p>
                  <div className="actions">
                    <button
                      onClick={() => handleUpdate(usuario.usuarioId, 2)} // 2 para aprobar
                      disabled={loading}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleUpdate(usuario.usuarioId, 3)} // 3 para rechazar
                      disabled={loading}
                    >
                      Rechazar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default SolicitudSuscripcionAdmin;


