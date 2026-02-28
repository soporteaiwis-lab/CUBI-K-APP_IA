'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MessageCircle, Mail, Video, BookOpen, Star, Loader2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, clases, loading, logout } = useGlobalContext();
  const router = useRouter();

  // Proteger la ruta: si no hay usuario y ya cargó, volver al login
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Agrupar clases por Fase usando useMemo para rendimiento
  const clasesPorFase = useMemo(() => {
    if (!clases) return {};
    return clases.reduce((acc, clase) => {
      const fase = clase.Titulo_Fase || 'Módulos Generales';
      if (!acc[fase]) acc[fase] = [];
      acc[fase].push(clase);
      return acc;
    }, {});
  }, [clases]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-white/50 mb-4" />
        <p className="text-white/50">Cargando tu espacio educativo...</p>
      </div>
    );
  }

  // Datos inyectados del usuario para el RadarChart
  const skillsData = [
    { subject: 'Prompting', A: Number(currentUser.Skill_Prompting) || 0, fullMark: 100 },
    { subject: 'Herramientas IA', A: Number(currentUser.Skill_Herramientas_IA) || 0, fullMark: 100 },
    { subject: 'Análisis', A: Number(currentUser.Skill_Analisis) || 0, fullMark: 100 },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Perfil */}
        <header className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{currentUser.Nombre}</h1>
            <div className="flex items-center gap-3 text-white/60">
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-white/5">
                {currentUser.Cargo || 'Estudiante'}
              </span>
              <span>@ {currentUser.Corporacion || 'AIWIS'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-between md:justify-end">
            <div className="flex gap-3">
              <a 
                href={`https://wa.me/${currentUser.Telefono}`} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 rounded-xl transition-all border border-white/10"
                title="Soporte WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${currentUser.Email_Corporativo}`} 
                className="p-3 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 rounded-xl transition-all border border-white/10"
                title="Correo Corporativo"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://meet.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 rounded-xl transition-all border border-white/10"
                title="Sala de Meet"
              >
                <Video className="w-5 h-5" />
              </a>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20 ml-4 md:ml-0"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Gráfica de Skills */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-8 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Tus Skills IA
            </h2>
            <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={skillsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Skills" 
                    dataKey="A" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="#3b82f6" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Columna Derecha: Malla Curricular */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Malla Curricular
            </h2>
            
            {Object.keys(clasesPorFase).length === 0 ? (
              <div className="p-8 text-center border border-white/10 border-dashed rounded-2xl text-white/40">
                No hay clases asignadas por el momento.
              </div>
            ) : (
              Object.entries(clasesPorFase).map(([fase, modulos]) => (
                <div key={fase} className="space-y-4">
                  <h3 className="text-lg font-medium text-white/80 border-b border-white/10 pb-3">
                    {fase}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modulos.map((clase, idx) => {
                      // Detectamos si es un Taller para destacarlo
                      const isTaller = clase.Tipo_Modulo?.toLowerCase().includes('taller');
                      
                      return (
                        <div 
                          key={idx} 
                          className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                            isTaller 
                              ? 'bg-purple-900/10 border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                              : 'bg-[#141414] border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                              isTaller 
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' 
                                : 'bg-white/5 text-white/60 border border-white/10'
                            }`}>
                              {clase.Tipo_Modulo || 'Clase'}
                            </span>
                            {clase.Duracion && (
                              <span className="text-xs font-mono text-white/40 bg-black/50 px-2 py-1 rounded">
                                {clase.Duracion}
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-lg mb-2 leading-tight">
                            {clase.Nombre_Clase || clase.nombre || 'Clase sin nombre'}
                          </h4>
                          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                            {clase.Descripcion || 'Sin descripción disponible.'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}