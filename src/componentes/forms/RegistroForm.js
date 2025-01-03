import React, { useState } from "react";
import "./RegistroForm.css"; // Asegúrate de tener estilos CSS

const RegistroForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/negocios/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especifica el tipo de contenido
        },
        body: JSON.stringify(formData), // Asegúrate de convertir el objeto a JSON
      });
  
      if (response.ok) {
        alert("Registro exitoso");
        setFormData({ username: "", email: "", password: "" }); // Resetea el formulario
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Algo salió mal"}`);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };
  

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default RegistroForm;
