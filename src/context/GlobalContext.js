'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTodo } from '@/lib/api';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({
    configuracion: null,
    usuarios: [],
    clases: [],
    proyectos: [],
    loading: true,
    error: null,
  });

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchTodo();
      setState({
        configuracion: data.configuracion || null,
        usuarios: data.usuarios || [],
        clases: data.clases || [],
        proyectos: data.proyectos || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message || 'Error al cargar datos' }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <GlobalContext.Provider value={{ ...state, refreshData: loadData }}>
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