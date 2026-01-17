// Configuración centralizada de la API

// Detectar si estamos en producción o desarrollo
const isProduction = window.location.hostname !== 'localhost';

// Base URL del backend
export const API_BASE_URL = isProduction 
  ? 'https://api.rod-b-op.com/negocios/api'  // Producción
  : 'http://localhost:8080/negocios/api';     // Desarrollo

// Opciones por defecto para fetch
export const getFetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Importante para CORS con cookies/auth
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // Agregar body si es POST/PUT
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Helper para construir URLs
export const buildApiUrl = (endpoint) => {
  // Si el endpoint ya tiene el prefijo /api, no lo duplicamos
  const cleanEndpoint = endpoint.startsWith('/api') 
    ? endpoint.substring(4) 
    : endpoint;
  
  return `${API_BASE_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : '/' + cleanEndpoint}`;
};

// Endpoints comunes
export const ENDPOINTS = {
  LOGIN: '/login',
  REGISTRO: '/registro',
  NEGOCIOS: '/negocios',
  ORDENES: '/ordenes',
  USUARIOS: '/usuarios',
  PRODUCTOS: '/productos',
  CATEGORIAS: '/categorias',
};

export default {
  API_BASE_URL,
  getFetchOptions,
  buildApiUrl,
  ENDPOINTS,
};
