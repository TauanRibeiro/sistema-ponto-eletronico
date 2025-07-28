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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardNav />
      
      {/* Header com gradiente moderno */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {greeting}, {session.user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 mt-2">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaClock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registrar Ponto</p>
                <p className="text-xs text-gray-500">Entrada/Saída</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaChartLine className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banco de Horas</p>
                <p className="text-xs text-gray-500">Saldo atual</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaBell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-xs text-gray-500">Pendências</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaCalendarCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resumo</p>
                <p className="text-xs text-gray-500">Hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaClock className="mr-2 text-blue-600" />
                  Registrar Ponto
                </h2>
              </div>
              <div className="p-6">
                <ClockInOut />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Histórico de Registros
                </h2>
              </div>
              <div className="p-6">
                <TimeHistory />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaChartLine className="mr-2 text-green-600" />
                  Resumo do Trabalho
                </h2>
              </div>
              <div className="p-6">
                <WorkSummary />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaChartLine className="mr-2 text-blue-600" />
                  Banco de Horas
                </h2>
              </div>
              <div className="p-6">
                <HourBank />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
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
  );
}
