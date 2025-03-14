import axios from 'axios';
import Cookies from 'js-cookie';

// Obtener la URL base de las variables de entorno o usar un valor por defecto
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// Crear la instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para incluir el token de autenticación en las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token desde las cookies
    const token = Cookies.get('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
