'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaSignInAlt, FaSignOutAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function ClockInOut() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lastAction, setLastAction] = useState<'entry' | 'exit' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const registerTime = async (type: 'entry' | 'exit') => {
    try {
      setIsLoading(true);
      setMessage('');

      // Obter localização
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      const response = await fetch('/api/register-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar ponto');
      }

      setLastAction(type);
      setMessage(type === 'entry' ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'PERMISSION_DENIED') {
        setMessage('Permissão de localização negada. Ative a localização para registrar o ponto.');
      } else if (err.code === 'TIMEOUT') {
        setMessage('Tempo limite para obter localização. Tente novamente.');
      } else {
        setMessage(err.message || 'Erro ao registrar ponto. Tente novamente.');
      }
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Relógio Digital */}
      <div className="text-center mb-6">
        <div className="glass-card rounded-2xl p-6 mb-4 shadow-lg">
          <div className="text-gray-800">
            <div className="text-sm font-medium opacity-80 mb-2">
              {format(currentTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="text-5xl font-mono font-bold tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <FaClock className="mr-1" />
          Horário local
        </div>
      </div>

      {/* Botões de Registro */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => registerTime('entry')}
          disabled={isLoading}
          className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
            lastAction === 'entry' 
              ? 'glass-card border-green-400 shadow-lg shadow-green-200' 
              : 'glass backdrop-blur-md border-white/30 hover:border-green-400 hover:shadow-lg hover:shadow-green-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
        >
          <div className={`p-4 rounded-xl mb-3 transition-all ${
            lastAction === 'entry' 
              ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md' 
              : 'bg-white/50 group-hover:bg-gradient-to-br group-hover:from-green-400 group-hover:to-green-600'
          }`}>
            <FaSignInAlt className={`h-7 w-7 ${
              lastAction === 'entry' ? 'text-white' : 'text-green-600 group-hover:text-white'
            }`} />
          </div>
          <span className="text-sm font-bold text-gray-800">Entrada</span>
          {lastAction === 'entry' && (
            <span className="text-xs text-green-600 mt-1 font-medium">Último registro</span>
          )}
        </button>

        <button
          onClick={() => registerTime('exit')}
          disabled={isLoading}
          className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
            lastAction === 'exit' 
              ? 'glass-card border-red-400 shadow-lg shadow-red-200' 
              : 'glass backdrop-blur-md border-white/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
        >
          <div className={`p-4 rounded-xl mb-3 transition-all ${
            lastAction === 'exit' 
              ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-md' 
              : 'bg-white/50 group-hover:bg-gradient-to-br group-hover:from-red-400 group-hover:to-red-600'
          }`}>
            <FaSignOutAlt className={`h-7 w-7 ${
              lastAction === 'exit' ? 'text-white' : 'text-red-600 group-hover:text-white'
            }`} />
          </div>
          <span className="text-sm font-bold text-gray-800">Saída</span>
          {lastAction === 'exit' && (
            <span className="text-xs text-red-600 mt-1 font-medium">Último registro</span>
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 glass-card rounded-xl border border-blue-300 mb-4 fade-in">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-700 text-sm font-semibold">Registrando ponto...</span>
        </div>
      )}

      {/* Mensagem de Status */}
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.includes('sucesso') 
            ? 'glass-card border-green-300 text-green-800' 
            : 'glass-card border-red-300 text-red-800'
        } fade-in`}>
          <div className="flex items-center">
            <div className="text-sm font-medium">
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Informação sobre Localização */}
      <div className="mt-6 p-3 glass backdrop-blur-md rounded-xl border border-white/30">
        <div className="flex items-center text-xs text-gray-700">
          <FaMapMarkerAlt className="mr-2 text-gray-500" />
          <span>Localização é registrada automaticamente para validação</span>
        </div>
      </div>
    </div>
  );
}
