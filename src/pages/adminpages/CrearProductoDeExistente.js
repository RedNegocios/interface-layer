// CrearProductoDeExistente.js
import React, { useEffect, useState } from "react";
import "./CrearProductoDeExistente.css";

const CrearProductoDeExistente = () => {
  const [negocios, setNegocios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [selectedProducto, setSelectedProducto] = useState("");
  const [precioDeVenta, setPrecioDeVenta] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/negocios/api/productos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          alert("Error al cargar los productos.");
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        alert("Error al conectar con el servidor.");
      }
    };

    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNegocio || !selectedProducto || !precioDeVenta) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/negocios/api/negocios-productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          negocio: { negocioId: selectedNegocio },
          producto: { productoId: selectedProducto },
          precioDeVenta: parseFloat(precioDeVenta),
        }),
      });

      if (response.ok) {
        alert("Producto creado exitosamente.");
        setSelectedNegocio("");
        setSelectedProducto("");
        setPrecioDeVenta("");
      } else {
        alert("Error al crear el producto.");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto-container">
      <h2>Crear Producto de Existente</h2>
      <form onSubmit={handleSubmit} className="formulario-centrado">
        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label htmlFor="producto-select">Selecciona un Producto:</label>
          <select
            id="producto-select"
            value={selectedProducto}
            onChange={(e) => setSelectedProducto(e.target.value)}
          >
            <option value="">-- Selecciona un Producto --</option>
            {productos.map((producto) => (
              <option key={producto.productoId} value={producto.productoId}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio-venta">Precio de Venta:</label>
          <input
            id="precio-venta"
            type="number"
            step="0.01"
            value={precioDeVenta}
            onChange={(e) => setPrecioDeVenta(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearProductoDeExistente;



