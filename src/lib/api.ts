// En Vite usamos import.meta.env, en Next.js sería process.env.NEXT_PUBLIC_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw79Ixm_2vDCAU56gbbAy3rFPZ3JoJrWmlxw0WdyCbx6hXQ3VSGxTnKrj0XsCOTKr0dPA/exec';

export const fetchTodo = async () => {
  try {
    // Usamos un proxy CORS gratuito (allorigins) para evitar los bloqueos de Google Apps Script
    // en entornos de desarrollo local o vistas previas web.
    const targetUrl = `${API_URL}?action=getTodo`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.warn('No se pudo conectar con Google Apps Script. Verificando permisos o CORS...', error.message);
    
    // Lanzamos el error para que el Contexto Global lo atrape y use los datos de prueba
    throw new Error('Error de conexión con la API');
  }
};
