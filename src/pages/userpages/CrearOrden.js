import React, { useState, useEffect } from "react";
import "./CrearOrden.css";

const CrearOrden = () => {
  const [negocios, setNegocios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedNegocio, setSelectedNegocio] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);

  // Obtener lista de negocios
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
          alert("Error al cargar los negocios.");
        }
      } catch (error) {
        console.error("Error al obtener los negocios:", error);
      }
    };

    fetchNegocios();
  }, []);

  // Obtener productos del negocio seleccionado
  const fetchProductos = async (negocioId) => {
    try {
      const response = await fetch(`http://localhost:8080/negocios/api/negocios-productos/productos-por-negocio/${negocioId}`, {
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
    }
  };

  const handleAgregarProducto = (producto) => {
    const productoEnCarrito = carrito.find((p) => p.negocioProductoId === producto.negocioProductoId);
    if (productoEnCarrito) {
      const updatedCarrito = carrito.map((p) =>
        p.negocioProductoId === producto.negocioProductoId
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
      setCarrito(updatedCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setMontoTotal(montoTotal + producto.precioDeVenta);
  };

  const handleCrearOrden = async () => {
    if (!selectedNegocio || carrito.length === 0) {
      alert("Selecciona un negocio y agrega productos al carrito.");
      return;
    }

    const lineasOrden = carrito.map((producto) => ({
      negocioProducto: producto,
      cantidad: producto.cantidad,
      precioUnitario: producto.precioDeVenta,
    }));

    const payload = {
      negocioId: selectedNegocio,
      montoTotal,
      lineasOrden,
    };

    try {
      const response = await fetch("http://localhost:8080/negocios/api/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Orden creada exitosamente.");
        setCarrito([]);
        setMontoTotal(0);
        setSelectedNegocio("");
      } else {
        alert("Error al crear la orden.");
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  return (
    <div className="crear-orden-container">
      <h2>Crear Orden</h2>
      <div className="dropdown-container">
        <label htmlFor="negocio-select">Selecciona un Negocio:</label>
        <select
          id="negocio-select"
          value={selectedNegocio}
          onChange={(e) => {
            setSelectedNegocio(e.target.value);
            fetchProductos(e.target.value);
          }}
        >
          <option value="">-- Selecciona un negocio --</option>
          {negocios.map((negocio) => (
            <option key={negocio.negocioId} value={negocio.negocioId}>
              {negocio.nombre}
            </option>
          ))}
        </select>
      </div>

      {productos.length > 0 && (
        <div className="productos-list">
          <h3>Productos</h3>
          <ul>
            {productos.map((producto) => (
              <li key={producto.negocioProductoId}>
                <p>{producto.producto.nombre} - ${producto.precioDeVenta}</p>
                <button onClick={() => handleAgregarProducto(producto)}>Agregar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {carrito.length > 0 && (
        <div className="carrito">
          <h3>Carrito</h3>
          <ul>
            {carrito.map((producto) => (
              <li key={producto.negocioProductoId}>
                <p>
                  {producto.producto.nombre} - ${producto.precioDeVenta} x {producto.cantidad}
                </p>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${montoTotal}</strong></p>
          <button onClick={handleCrearOrden}>Crear Orden</button>
        </div>
      )}
    </div>
  );
};

export default CrearOrden;



