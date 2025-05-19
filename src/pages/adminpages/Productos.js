import React from "react";
import CrudTable  from "./CRUDGenerico";

const NegocioProductoCRUD = () => {
  const endpoint = "http://localhost:8080/negocios/api/negocios-productos";
  const columns = [
    { key: "id", label: "ID" },
    { key: "negocio.nombre", label: "Negocio" },
    { key: "producto.nombre", label: "Producto" },
    { key: "precioDeVenta", label: "Precio de Venta" },
    // TO-DO: 
    // Agregar bandera nueva con posibilidad de cambiarla entre 0 y 1.
  ];
  const formFields = [
    { name: "productoId", label: "ID Producto", type: "number" },
    { name: "precioDeVenta", label: "Precio de Venta", type: "number" },
  ];

  return (
    <CrudTable
      endpoint={endpoint}
      columns={columns}
      entityName="Negocio Producto"
      formFields={formFields}
    />
  );
};

export default NegocioProductoCRUD;
