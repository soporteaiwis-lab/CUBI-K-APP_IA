'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MessageCircle, Mail, Video, BookOpen, Star, Loader2, LogOut, Upload, CheckCircle, X } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, clases, proyectos, loading, logout, refreshData } = useGlobalContext();
  const router = useRouter();
  
  // Estados para el Modal de Subir Proyecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [projectUrl, setProjectUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.Rol !== 'Usuario')) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  const clasesPorFase = useMemo(() => {
    if (!clases) return {};
    return clases.reduce((acc, clase) => {
      const fase = clase.Titulo_Fase || 'Módulos Generales';
      if (!acc[fase]) acc[fase] = [];
      acc[fase].push(clase);
      return acc;
    }, {});
  }, [clases]);

  const handleOpenModal = (clase) => {
    setSelectedClase(clase);
    setProjectUrl('');
    setIsModalOpen(true);
  };

  const handleSubmitProject = async () => {
    if (!projectUrl.trim()) {
      alert('Por favor ingresa una URL válida.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submitProyecto',
          id_usuario: currentUser.ID_Usuario,
          id_clase: selectedClase.ID_Clase,
          url_proyecto: projectUrl
        })
      });

      if (!response.ok) throw new Error('Error al enviar el proyecto');
      
      await refreshData();
      setIsModalOpen(false);
      alert('¡Proyecto enviado con éxito!');
    } catch (error) {
      alert('Hubo un problema al enviar el proyecto: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-white/50 mb-4" />
        <p className="text-white/50">Cargando tu espacio educativo...</p>
      </div>
    );
  }

  const skillsData = [
    { subject: 'Prompting', A: Number(currentUser.Skill_Prompting) || 0, fullMark: 100 },
    { subject: 'Herramientas IA', A: Number(currentUser.Skill_Herramientas_IA) || 0, fullMark: 100 },
    { subject: 'Análisis', A: Number(currentUser.Skill_Analisis) || 0, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Perfil */}
        <header className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{currentUser.Nombre}</h1>
            <div className="flex items-center gap-3 text-white/60">
              <span className="px-3 py-1 bg-white/5 rounded-full text-sm border border-white/5">
                {currentUser.Cargo || 'Estudiante'}
              </span>
              <span>@ {currentUser.Empresa || 'AIWIS'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-between md:justify-end">
            <div className="flex gap-3">
              <a href={`https://wa.me/${currentUser.Telefono}`} target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-all border border-white/10">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`mailto:${currentUser.Email_Corporativo}`} className="p-3 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-xl transition-all border border-white/10">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 rounded-xl transition-all border border-white/10">
                <Video className="w-5 h-5" />
              </a>
            </div>
            <button onClick={() => { logout(); router.push('/'); }} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20 ml-4 md:ml-0">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfica de Skills */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-8 lg:col-span-1 flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Tus Skills IA
            </h2>
            <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={skillsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Malla Curricular */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-purple-400" /> Malla Curricular
            </h2>
            
            {Object.entries(clasesPorFase).map(([fase, modulos]) => (
              <div key={fase} className="space-y-4">
                <h3 className="text-lg font-medium text-white/80 border-b border-white/10 pb-3">{fase}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulos.map((clase, idx) => {
                    const isTaller = clase.Tipo_Modulo?.toLowerCase().includes('taller');
                    // Buscar si el alumno ya envió este proyecto
                    const proyectoEnviado = proyectos?.find(p => p.ID_Usuario === currentUser.ID_Usuario && p.ID_Clase === clase.ID_Clase);

                    return (
                      <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${isTaller ? 'bg-purple-900/10 border-purple-500/30' : 'bg-[#141414] border-white/5'}`}>
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${isTaller ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                              {clase.Tipo_Modulo || 'Clase'}
                            </span>
                          </div>
                          <h4 className="font-medium text-lg mb-2 leading-tight">{clase.Nombre_Clase}</h4>
                          <p className="text-sm text-white/50 line-clamp-2 mb-4">{clase.Descripcion}</p>
                        </div>

                        {/* Lógica de Botones para Talleres */}
                        {isTaller && (
                          <div className="mt-auto pt-4 border-t border-white/5">
                            {proyectoEnviado ? (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
                                  <CheckCircle className="w-4 h-4" /> Proyecto Enviado
                                </div>
                                {proyectoEnviado.Nota_Evaluacion ? (
                                  <div className="mt-2">
                                    <span className="text-xs text-white/50 block">Calificación:</span>
                                    <span className="text-lg font-bold text-white">{proyectoEnviado.Nota_Evaluacion}/100</span>
                                    {proyectoEnviado.Comentarios_Admin && (
                                      <p className="text-xs text-white/60 mt-1 italic">"{proyectoEnviado.Comentarios_Admin}"</p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-emerald-400/70">Pendiente de evaluación</span>
                                )}
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleOpenModal(clase)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all"
                              >
                                <Upload className="w-4 h-4" /> Subir Proyecto
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Subir Proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold">Entregar Proyecto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-white/60">
                Estás entregando el proyecto para: <strong className="text-white">{selectedClase?.Nombre_Clase}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">URL de tu Proyecto (Ej. ChatGPT, Drive, etc.)</label>
                <input 
                  type="url" 
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button 
                onClick={handleSubmitProject}
                disabled={isSubmitting}
                className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Entrega'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}