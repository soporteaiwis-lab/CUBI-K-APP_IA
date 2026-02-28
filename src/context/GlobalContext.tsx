import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTodo } from '../lib/api';

interface User {
  Email_Corporativo: string;
  Rol: 'Admin' | 'Usuario';
  [key: string]: any;
}

interface AppState {
  configuracion: any;
  usuarios: User[];
  clases: any[];
  proyectos: any[];
  loading: boolean;
  error: string | null;
}

interface GlobalContextType extends AppState {
  refreshData: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
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
      // Para propósitos de demostración, si la API falla, usaremos datos mockeados
      // ya que no tenemos una URL real de Apps Script configurada.
      let data;
      try {
        data = await fetchTodo();
      } catch (e) {
        console.warn('Usando datos de prueba ya que la API falló o no está configurada.');
        data = {
          configuracion: { theme: 'dark', portalName: 'CUBI-K Portal' },
          usuarios: [
            { Email_Corporativo: 'admin@aiwis.cl', Rol: 'Admin', Nombre: 'Armin Salazar', Estado: 'Activo' },
            { Email_Corporativo: 'user@aiwis.cl', Rol: 'Usuario', Nombre: 'Estudiante Demo', Estado: 'Activo' },
            { Email_Corporativo: 'maria@aiwis.cl', Rol: 'Usuario', Nombre: 'María López', Estado: 'Inactivo' },
            { Email_Corporativo: 'carlos@aiwis.cl', Rol: 'Usuario', Nombre: 'Carlos Pérez', Estado: 'Activo' }
          ],
          clases: [
            { id: 1, nombre: 'Introducción a IA', estudiantes: 24, estado: 'En curso' },
            { id: 2, nombre: 'Machine Learning Básico', estudiantes: 18, estado: 'Planificada' },
            { id: 3, nombre: 'Ética en IA', estudiantes: 32, estado: 'Completada' }
          ],
          proyectos: [
            { id: 1, nombre: 'Chatbot Corporativo', progreso: 75, responsable: 'Armin Salazar' },
            { id: 2, nombre: 'Análisis de Datos', progreso: 30, responsable: 'María López' },
            { id: 3, nombre: 'Automatización RPA', progreso: 100, responsable: 'Carlos Pérez' }
          ]
        };
      }
      
      setState({
        configuracion: data.configuracion || null,
        usuarios: data.usuarios || [],
        clases: data.clases || [],
        proyectos: data.proyectos || [],
        loading: false,
        error: null,
      });
    } catch (error: any) {
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
