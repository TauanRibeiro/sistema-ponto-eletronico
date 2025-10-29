'use client';

import { useSession } from 'next-auth/react';
import { FaClock, FaChartLine, FaBell, FaCalendarCheck } from 'react-icons/fa';
import ClockInOut from '@/components/ClockInOut';
import TimeHistory from '@/components/TimeHistory';
import WorkSummary from '@/components/WorkSummary';
import Alerts from '@/components/Alerts';
import HourBank from '@/components/HourBank';
import DashboardNav from '@/components/DashboardNav';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></div>
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-3xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative">
        <DashboardNav />
        
        {/* Header com glassmorphism */}
        <header className="glass backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="fade-in">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  {greeting}, {session.user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/90 mt-2 drop-shadow">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right slide-in">
                <div className="text-white drop-shadow-lg text-2xl font-mono font-bold">
                  <FaClock className="inline mr-2" />
                  {new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Cards de Ação Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                  <FaClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-800">Registrar Ponto</p>
                  <p className="text-xs text-gray-600">Entrada/Saída</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                  <FaChartLine className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-800">Banco de Horas</p>
                  <p className="text-xs text-gray-600">Saldo atual</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <FaBell className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-800">Alertas</p>
                  <p className="text-xs text-gray-600">Pendências</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                  <FaCalendarCheck className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-800">Resumo</p>
                  <p className="text-xs text-gray-600">Hoje</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8 slide-in">
              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <FaClock className="mr-2 text-blue-600" />
                    Registrar Ponto
                  </h2>
                </div>
                <div className="p-6">
                  <ClockInOut />
                </div>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <h2 className="text-lg font-bold text-gray-800">
                    Histórico de Registros
                  </h2>
                </div>
                <div className="p-6">
                  <TimeHistory />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8 slide-in">
              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <FaChartLine className="mr-2 text-green-600" />
                    Resumo do Trabalho
                  </h2>
                </div>
                <div className="p-6">
                  <WorkSummary />
                </div>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <FaChartLine className="mr-2 text-blue-600" />
                    Banco de Horas
                  </h2>
                </div>
                <div className="p-6">
                  <HourBank />
                </div>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <FaBell className="mr-2 text-yellow-600" />
                    Alertas e Notificações
                  </h2>
                </div>
                <div className="p-6">
                  <Alerts />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
