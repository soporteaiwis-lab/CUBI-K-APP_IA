import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function Admin() {
  const { usuarios } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Panel de Administración</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">Usuarios Registrados</h2>
            <div className="text-4xl font-light">{usuarios.length}</div>
          </div>
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">Estado de API</h2>
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              Conectado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
