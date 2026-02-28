import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Dashboard de Estudiante</h1>
              <p className="text-sm text-white/50">CUBI-K Portal</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </header>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-light mb-4">Bienvenido a tu espacio educativo</h2>
          <p className="text-white/50 max-w-md mx-auto">
            Aquí podrás ver tus clases, proyectos y progreso. El contenido se cargará desde Google Apps Script.
          </p>
        </div>
      </div>
    </div>
  );
}
