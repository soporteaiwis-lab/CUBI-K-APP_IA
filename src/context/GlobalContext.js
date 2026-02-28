'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({
    configuracion: null,
    usuarios: [],
    clases: [],
    proyectos: [],
    currentUser: null, // Guardaremos aquí al usuario logueado
    loading: true,
    error: null,
  });

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Hacemos fetch a nuestra propia API de Next.js
      const response = await fetch('/api/sheet?action=getTodo');
      
      if (!response.ok) {
        throw new Error('Error al obtener datos del servidor');
      }
      
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        configuracion: data.configuracion || null,
        usuarios: data.usuarios || [],
        clases: data.clases || [],
        proyectos: data.proyectos || [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error de conexión' 
      }));
    }
  };

  // Se ejecuta solo una vez al montar la aplicación
  useEffect(() => {
    loadData();
  }, []);

  // Función auxiliar para el Login
  const login = (email) => {
    const user = state.usuarios.find(u => u.Email_Corporativo?.toLowerCase() === email.toLowerCase());
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return user;
    }
    return null;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  return (
    <GlobalContext.Provider value={{ ...state, refreshData: loadData, login, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext debe usarse dentro de un GlobalProvider');
  }
  return context;
};