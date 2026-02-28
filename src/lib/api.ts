import axios from 'axios';

// En Vite usamos import.meta.env, en Next.js sería process.env.NEXT_PUBLIC_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw.../exec';

export const fetchTodo = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=getTodo`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Google Apps Script:', error);
    throw error;
  }
};
