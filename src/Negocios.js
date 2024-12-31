import React from "react";
import CrudTable from "./CRUDGenerico";

const Negocios = () => {
  const columns = [
    { key: "negocioId", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "fechaCreacion", label: "Fecha de Creación" },
    { key: "activo", label: "Activo" },
  ];

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea", required: false },
  ];

  return (
    <CrudTable
      endpoint="http://localhost:8080/negocios/api/negocios" // URL del endpoint del backend
      columns={columns} // Configuración de las columnas
      entityName="Negocio" // Nombre de la entidad para encabezados y mensajes
      formFields={formFields} // Configuración del formulario
    />
  );
};

export default Negocios;

