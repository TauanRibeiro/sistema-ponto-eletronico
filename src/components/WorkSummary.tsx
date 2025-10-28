'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaCalendar } from 'react-icons/fa';

type WorkSummaryData = {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  daysWorked: number;
};

export default function WorkSummary() {
  const [summary, setSummary] = useState<WorkSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // Simulated data - in a real scenario, this would call an API
      const data: WorkSummaryData = {
        todayHours: 7.5,
        weekHours: 37.5,
        monthHours: 160,
        daysWorked: 20
      };
      setSummary(data);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass backdrop-blur-md rounded-xl shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/30 rounded"></div>
          <div className="h-4 bg-white/30 rounded"></div>
          <div className="h-4 bg-white/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="glass backdrop-blur-md rounded-xl shadow p-6">
        <p className="text-gray-600">Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hoje */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
              <FaClock className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 font-medium">Hoje</p>
              <p className="text-xl font-bold text-gray-800">{summary.todayHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semana */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-md">
              <FaCalendar className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 font-medium">Esta Semana</p>
              <p className="text-xl font-bold text-gray-800">{summary.weekHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mês */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-green-600 shadow-md">
              <FaCheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-600 font-medium">Este Mês</p>
              <p className="text-xl font-bold text-gray-800">{summary.monthHours.toFixed(0)}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso Visual */}
      <div className="glass-card p-4 rounded-xl">
        <p className="text-xs text-gray-600 font-medium mb-2">Progresso Mensal</p>
        <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((summary.monthHours / 176) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-right">
          {summary.daysWorked} dias trabalhados
        </p>
      </div>
    </div>
  );
}
