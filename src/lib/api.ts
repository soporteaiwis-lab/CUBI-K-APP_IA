// En Vite usamos import.meta.env, en Next.js sería process.env.NEXT_PUBLIC_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw79Ixm_2vDCAU56gbbAy3rFPZ3JoJrWmlxw0WdyCbx6hXQ3VSGxTnKrj0XsCOTKr0dPA/exec';

export const fetchTodo = async () => {
  try {
    // Usamos fetch en lugar de axios para evitar peticiones preflight (OPTIONS)
    // que suelen causar problemas de CORS con Google Apps Script.
    const response = await fetch(`${API_URL}?action=getTodo`, {
      method: 'GET',
      headers: {
        // No enviamos headers personalizados para mantenerlo como una "simple request"
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching data from Google Apps Script:', error);
    
    // Si es un error de red (CORS) o 403, usualmente es por permisos en Apps Script
    if (error.message === 'Failed to fetch' || error.message === 'Network Error' || (error.response && error.response.status === 403)) {
      throw new Error(
        'Error de conexión con Google Apps Script. ' +
        'Asegúrate de que la API esté publicada como Aplicación Web y que "Quién tiene acceso" esté configurado como "Cualquier persona" (Anyone).'
      );
    }
    
    throw error;
  }
};
