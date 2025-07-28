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
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg p-4 mb-4">
          <div className="text-white">
            <div className="text-sm opacity-80 mb-1">
              {format(currentTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="text-4xl font-mono font-bold tracking-wider">
              {format(currentTime, 'HH:mm:ss')}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <FaClock className="mr-1" />
          Horário local
        </div>
      </div>

      {/* Botões de Registro */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => registerTime('entry')}
          disabled={isLoading}
          className={`group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 ${
            lastAction === 'entry' 
              ? 'bg-green-50 border-green-300 text-green-700' 
              : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}
        >
          <div className={`p-3 rounded-full mb-2 transition-colors ${
            lastAction === 'entry' ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-green-100'
          }`}>
            <FaSignInAlt className={`h-6 w-6 ${
              lastAction === 'entry' ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'
            }`} />
          </div>
          <span className="text-sm font-semibold">Entrada</span>
          {lastAction === 'entry' && (
            <span className="text-xs text-green-600 mt-1">Último registro</span>
          )}
        </button>

        <button
          onClick={() => registerTime('exit')}
          disabled={isLoading}
          className={`group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 ${
            lastAction === 'exit' 
              ? 'bg-red-50 border-red-300 text-red-700' 
              : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}
        >
          <div className={`p-3 rounded-full mb-2 transition-colors ${
            lastAction === 'exit' ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-100'
          }`}>
            <FaSignOutAlt className={`h-6 w-6 ${
              lastAction === 'exit' ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'
            }`} />
          </div>
          <span className="text-sm font-semibold">Saída</span>
          {lastAction === 'exit' && (
            <span className="text-xs text-red-600 mt-1">Último registro</span>
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-700 text-sm">Registrando ponto...</span>
        </div>
      )}

      {/* Mensagem de Status */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.includes('sucesso') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className="text-sm">
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Informação sobre Localização */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center text-xs text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>Localização é registrada automaticamente para validação</span>
        </div>
      </div>
    </div>
  );
}
