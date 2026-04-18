import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Conectar al contenedor API expuesto en el puerto 3000
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
