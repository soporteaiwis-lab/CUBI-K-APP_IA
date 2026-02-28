import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert, Users, BookOpen, FolderKanban, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const { usuarios, clases, proyectos, loading } = useGlobalContext();
  const navigate = useNavigate();

  // Preparar datos para el gráfico
  const chartData = [
    { name: 'Usuarios', cantidad: usuarios.length },
    { name: 'Clases', cantidad: clases.length },
    { name: 'Proyectos', cantidad: proyectos.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white/80" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Panel de Administración</h1>
              <p className="text-sm text-white/50">Gestión de plataforma CUBI-K</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Usuarios" 
            value={usuarios.length} 
            icon={<Users className="w-5 h-5 text-blue-400" />} 
          />
          <StatCard 
            title="Clases Activas" 
            value={clases.length} 
            icon={<BookOpen className="w-5 h-5 text-emerald-400" />} 
          />
          <StatCard 
            title="Proyectos" 
            value={proyectos.length} 
            icon={<FolderKanban className="w-5 h-5 text-purple-400" />} 
          />
          <StatCard 
            title="Estado API" 
            value="Conectado" 
            icon={<Activity className="w-5 h-5 text-emerald-400" />} 
            valueClass="text-emerald-400 text-xl"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-medium mb-6">Resumen de Plataforma</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  />
                  <Bar dataKey="cantidad" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Users List */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-medium mb-6">Usuarios Recientes</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {usuarios.slice(0, 5).map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-medium border border-white/10">
                      {user.Nombre ? user.Nombre.charAt(0).toUpperCase() : user.Email_Corporativo.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.Nombre || 'Usuario'}</p>
                      <p className="text-xs text-white/40">{user.Email_Corporativo}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${
                    user.Rol === 'Admin' 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {user.Rol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, valueClass = "text-3xl font-light" }: { title: string, value: string | number, icon: React.ReactNode, valueClass?: string }) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-white/50">{title}</h3>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
          {icon}
        </div>
      </div>
      <div className={valueClass}>{value}</div>
    </div>
  );
}
