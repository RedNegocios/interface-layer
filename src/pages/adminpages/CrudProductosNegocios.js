import React, { useState, useEffect } from "react";
import "./CrudProductosNegocios.css";

const CrudProductosNegocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [productosPorNegocio, setProductosPorNegocio] = useState({});
  const [loading, setLoading] = useState(false);

  // Obtener los negocios asociados al administrador
  useEffect(() => {
    const fetchNegocios = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/negocios/api/negocios/admin-negocios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setNegocios(data);
  
          // Obtener los productos asociados a cada negocio
          const productosPromises = data.map((negocio) =>
            fetch(`http://localhost:8080/negocios/api/negocios-productos/productos-por-negocio/${negocio.negocioId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }).then((res) => (res.ok ? res.json() : []))
          );
  
          const productosData = await Promise.all(productosPromises);
          const productosMap = data.reduce((acc, negocio, index) => {
            acc[negocio.negocioId] = productosData[index];
            return acc;
          }, {});
          setProductosPorNegocio(productosMap);
        } else {
          alert("Error al cargar los negocios.");
        }
      } catch (error) {
        console.error("Error al obtener los negocios:", error);
        alert("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchNegocios();
  }, []);
  

  const handleUpdateProducto = async (negocioId, producto) => {
    try {
      const response = await fetch(`http://localhost:8080/negocios/api/negocios-productos/${producto.negocioProductoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(producto),
      });

      if (response.ok) {
        alert("Producto actualizado con éxito.");
        // Actualizar la lista local de productos
        setProductosPorNegocio((prev) => ({
          ...prev,
          [negocioId]: prev[negocioId].map((p) =>
            p.negocioProductoId === producto.negocioProductoId ? producto : p
          ),
        }));
      } else {
        alert("Error al actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleDeleteProducto = async (negocioId, productoId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`http://localhost:8080/negocios/api/negocios-productos/${productoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        alert("Producto eliminado con éxito.");
        // Actualizar la lista local de productos
        setProductosPorNegocio((prev) => ({
          ...prev,
          [negocioId]: prev[negocioId].filter((p) => p.negocioProductoId !== productoId),
        }));
      } else {
        alert("Error al eliminar el producto.");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="crud-productos-negocios-container">
      <h2>Gestión de Productos por Negocio</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : negocios.length === 0 ? (
        <p>No hay negocios asociados.</p>
      ) : (
        negocios.map((negocio) => (
          <div key={negocio.negocioId} className="negocio-section">
            <h3>{negocio.nombre}</h3>
            <table className="productos-table">
              <thead>
  <tr>
    <th>Nombre</th>
    <th>Descripción</th>
    <th>Precio</th>
    <th>Precio de Venta</th>
    <th>Visible</th> {/* <-- Nueva columna */}
    <th>Acciones</th>
  </tr>
          </thead>
          <tbody>
            {productosPorNegocio[negocio.negocioId]?.map((producto) => (
              <tr key={producto.negocioProductoId}>
                <td>{producto.producto.nombre}</td>
                <td>{producto.producto.descripcion}</td>
                <td>{producto.producto.precio}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={producto.precioDeVenta}
                    onChange={(e) =>
                      handleUpdateProducto(negocio.negocioId, {
                        ...producto,
                        precioDeVenta: parseFloat(e.target.value),
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={producto.visualizacionProducto}
                    onChange={(e) =>
                      handleUpdateProducto(negocio.negocioId, {
                        ...producto,
                        visualizacionProducto: e.target.checked,
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteProducto(negocio.negocioId, producto.negocioProductoId)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default CrudProductosNegocios;
