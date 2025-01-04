import React, { useState, useEffect } from "react";
import "./CRUDGenerico.css"; // Estilos personalizados

const CrudTable = ({ endpoint, columns, entityName, formFields }) => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"), // Agrega el Bearer token
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${endpoint}/${editId}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+ localStorage.getItem("authToken"), // Agrega el Bearer token
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        alert(`${isEditing ? "Actualizado" : "Creado"} con éxito`);
        setFormData({});
        setIsEditing(false);
        setEditId(null);
      } else {
        alert("Error al guardar los datos");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de eliminar este ${entityName}?`)) return;
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("authToken"), // Agrega el Bearer token
        },
      });

      if (response.ok) {
        fetchData();
        alert("Eliminado con éxito");
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="crud-container">
      <h2>Gestión de {entityName}</h2>
      <table className="crud-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
              <td>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Formulario para crear/editar */}
      <form onSubmit={handleSubmit}>
        <h3>{isEditing ? "Editar" : "Crear"} {entityName}</h3>
        {formFields.map((field) => (
          <div key={field.name}>
            <label>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
          </div>
        ))}
        <button type="submit">{isEditing ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
};

export default CrudTable;
