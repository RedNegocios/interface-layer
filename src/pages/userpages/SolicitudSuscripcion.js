import React, { useState, useEffect } from "react";
import "./SolicitudSuscripcion.css";

const SolicitudSuscripcion = () => {
  const [negocios, setNegocios] = useState([]); // Lista de negocios
  const [selectedNegocio, setSelectedNegocio] = useState(""); // Negocio seleccionado
  const [loading, setLoading] = useState(false);

  // Cargar lista de negocios al montar el componente
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const response = await fetch("http://localhost:8080/negocios/api/negocios", {
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

    fetchNegocios();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNegocio) {
      alert("Por favor, selecciona un negocio.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/negocios/api/usuario-negocio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          negocio: { negocioId: parseInt(selectedNegocio, 10) }, // Convertir a número y usar "negocioId"
        }),
      });

      if (response.ok) {
        alert("Solicitud enviada exitosamente.");
      } else {
        alert("Error al enviar la solicitud.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitud-container">
      <h2>Solicitud de Suscripción</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="dropdown-container">
          <label htmlFor="negocio-select">Selecciona un Negocio:</label>
          <select
            id="negocio-select"
            value={selectedNegocio}
            onChange={(e) => setSelectedNegocio(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Selecciona un Negocio --</option>
            {negocios.map((negocio) => (
              <option key={negocio.negocioId} value={negocio.negocioId}>
                {negocio.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading || !selectedNegocio}>
          {loading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
};

export default SolicitudSuscripcion;


