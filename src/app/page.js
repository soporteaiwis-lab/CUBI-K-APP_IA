'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { usuarios, loading } = useGlobalContext();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Por favor ingresa tu correo corporativo.');
      return;
    }

    // Buscar usuario ignorando mayúsculas/minúsculas
    const user = usuarios.find(u => u.Email_Corporativo.toLowerCase() === email.toLowerCase());

    if (user) {
      if (user.Rol === 'Admin') {
        router.push('/admin');
      } else if (user.Rol === 'Usuario') {
        router.push('/dashboard');
      } else {
        setErrorMsg('Rol no reconocido. Contacta a soporte.');
      }
    } else {
      setErrorMsg('Usuario no encontrado. Verifica tu correo corporativo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">CUBI-K Portal</h1>
          <p className="text-sm text-white/50">Ingresa con tu correo corporativo para continuar</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-white/50 mb-4" />
            <p className="text-sm text-white/50">Cargando configuración...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/50 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 sm:text-sm transition-all"
                  placeholder="tu@aiwis.cl"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-black bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 focus:ring-offset-[#111111] transition-all"
            >
              Ingresar al Portal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}