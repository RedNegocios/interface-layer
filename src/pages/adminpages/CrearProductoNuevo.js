import React, { useEffect, useState } from "react";
import "./CrearProductoNuevo.css";

const CrearProductoNuevo = () => {
  const [negocios, setNegocios] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [precioDeVenta, setPrecioDeVenta] = useState("");
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener la lista de negocios asociados al administrador
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const response = await fetch("http://localhost:8080/negocios/api/negocios/admin-negocios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNegocios(data);
        } else {
          alert("Error al cargar los negocios.");
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
    if (!selectedNegocio || !nombreProducto || !precioProducto || !precioDeVenta) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      // Crear el producto
      const productoResponse = await fetch("http://localhost:8080/negocios/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          nombre: nombreProducto,
          descripcion: descripcionProducto,
          precio: parseFloat(precioProducto),
        }),
      });

      if (!productoResponse.ok) {
        alert("Error al crear el producto.");
        return;
      }

      const producto = await productoResponse.json();

      // Crear el registro en NegocioProducto
      const negocioProductoResponse = await fetch("http://localhost:8080/negocios/api/negocios-productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          negocio: { negocioId: selectedNegocio },
          producto: { productoId: producto.productoId },
          precioDeVenta: parseFloat(precioDeVenta),
        }),
      });

      if (negocioProductoResponse.ok) {
        alert("Producto creado y asociado exitosamente.");
        setNombreProducto("");
        setDescripcionProducto("");
        setPrecioProducto("");
        setPrecioDeVenta("");
        setSelectedNegocio("");
      } else {
        alert("Error al asociar el producto al negocio.");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto-nuevo-container">
      <h2>Crear Producto Nuevo</h2>
      <form onSubmit={handleSubmit}>
        {/* Selección de negocio */}
        <div className="dropdown-container">
          <label htmlFor="negocio-select">Selecciona un Negocio:</label>
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
        </div>

        {/* Nombre del producto */}
        <div className="input-container">
          <label htmlFor="nombre-producto">Nombre del Producto:</label>
          <input
            id="nombre-producto"
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </div>

        {/* Descripción del producto */}
        <div className="input-container">
          <label htmlFor="descripcion-producto">Descripción del Producto:</label>
          <textarea
            id="descripcion-producto"
            value={descripcionProducto}
            onChange={(e) => setDescripcionProducto(e.target.value)}
          />
        </div>

        {/* Precio del producto */}
        <div className="input-container">
          <label htmlFor="precio-producto">Precio del Producto:</label>
          <input
            id="precio-producto"
            type="number"
            step="0.01"
            value={precioProducto}
            onChange={(e) => setPrecioProducto(e.target.value)}
          />
        </div>

        {/* Precio de venta */}
        <div className="input-container">
          <label htmlFor="precio-venta">Precio de Venta:</label>
          <input
            id="precio-venta"
            type="number"
            step="0.01"
            value={precioDeVenta}
            onChange={(e) => setPrecioDeVenta(e.target.value)}
          />
        </div>

        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProductoNuevo;
