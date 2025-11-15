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
    <div className="container animate-fade-in">
      <div className="card">
        <div className="card-header">
          <h2 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 'var(--font-semibold)', 
            color: 'var(--gray-900)',
            margin: 0 
          }}>
            Crear Nueva Orden
          </h2>
          <p style={{ 
            color: 'var(--gray-600)', 
            margin: 'var(--space-2) 0 0',
            fontSize: 'var(--text-base)'
          }}>
            Selecciona un negocio y agrega productos a tu orden
          </p>
        </div>

        <div className="card-body">
          <div className="form-group">
            <label className="form-label" htmlFor="negocio-select">
              Selecciona un Negocio
            </label>
            <select
              id="negocio-select"
              className="form-input"
              value={selectedNegocio}
              onChange={(e) => {
                setSelectedNegocio(e.target.value);
                fetchProductos(e.target.value);
              }}
            >
              <option value="">-- Selecciona un Negocio --</option>
              {negocios.map((negocio) => (
                <option key={negocio.negocioId} value={negocio.negocioId}>
                  {negocio.nombre}
                </option>
              ))}
            </select>
          </div>

          {productos.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h3 style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-4)',
                color: 'var(--gray-900)'
              }}>
                Productos Disponibles
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: 'var(--space-4)' 
              }}>
                {productos.map((producto) => (
                  <div key={producto.negocioProductoId} className="card hover-lift" style={{ 
                    border: '1px solid var(--gray-200)',
                    transition: 'all var(--transition-normal)'
                  }}>
                    <div className="card-body">
                      <h4 style={{ 
                        fontSize: 'var(--text-base)', 
                        fontWeight: 'var(--font-medium)',
                        marginBottom: 'var(--space-2)',
                        color: 'var(--gray-900)'
                      }}>
                        {producto.producto.nombre}
                      </h4>
                      <p style={{ 
                        fontSize: 'var(--text-lg)', 
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--success-600)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        ${producto.precioDeVenta.toFixed(2)}
                      </p>
                      <button 
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => handleAgregarProducto(producto)}
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {carrito.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <div className="card" style={{ backgroundColor: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                <div className="card-header" style={{ backgroundColor: 'var(--success-100)' }}>
                  <h3 style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 'var(--font-semibold)',
                    margin: 0,
                    color: 'var(--success-800)'
                  }}>
                    🛒 Carrito de Compras
                  </h3>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    {carrito.map((producto) => (
                      <div key={producto.negocioProductoId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-3) 0',
                        borderBottom: '1px solid var(--success-200)'
                      }}>
                        <div>
                          <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--gray-900)' }}>
                            {producto.producto.nombre}
                          </span>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                            ${producto.precioDeVenta.toFixed(2)} × {producto.cantidad}
                          </div>
                        </div>
                        <span style={{ 
                          fontWeight: 'var(--font-semibold)', 
                          color: 'var(--success-700)',
                          fontSize: 'var(--text-base)'
                        }}>
                          ${(producto.precioDeVenta * producto.cantidad).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--success-100)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--success-300)'
                  }}>
                    <span style={{ 
                      fontSize: 'var(--text-lg)', 
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--success-800)'
                    }}>
                      Total:
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-2xl)', 
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--success-700)'
                    }}>
                      ${montoTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-success btn-lg"
                    style={{ width: '100%' }}
                    onClick={handleCrearOrden}
                  >
                    🚀 Crear Orden
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrearOrden;



