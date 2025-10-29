'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type HourBankData = {
  totalWorkedHours: number;
  expectedHours: number;
  balance: number;
  weeklyHours: number;
  monthlyBalance: number;
};

export default function HourBank() {
  const [bankData, setBankData] = useState<HourBankData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankData();
  }, []);

  const fetchBankData = async () => {
    try {
      const response = await fetch('/api/hour-bank');
      if (!response.ok) throw new Error('Falha ao carregar banco de horas');
      const data = await response.json();
      setBankData(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass backdrop-blur-md rounded-xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white/30 rounded mb-4"></div>
          <div className="h-4 bg-white/30 rounded mb-2"></div>
          <div className="h-4 bg-white/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!bankData) {
    return (
      <div className="glass backdrop-blur-md rounded-xl shadow p-6">
        <p className="text-gray-600">Dados não disponíveis</p>
      </div>
    );
  }

  const isPositive = bankData.balance >= 0;

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 glass backdrop-blur-md rounded-xl">
          <span className="text-sm font-medium text-gray-700">Horas Trabalhadas (Mês):</span>
          <span className="font-bold text-gray-800">{bankData.totalWorkedHours.toFixed(1)}h</span>
        </div>
        
        <div className="flex justify-between items-center p-3 glass backdrop-blur-md rounded-xl">
          <span className="text-sm font-medium text-gray-700">Horas Esperadas:</span>
          <span className="font-bold text-gray-800">{bankData.expectedHours.toFixed(1)}h</span>
        </div>
        
        <div className="flex justify-between items-center p-3 glass backdrop-blur-md rounded-xl">
          <span className="text-sm font-medium text-gray-700">Horas na Semana:</span>
          <span className="font-bold text-gray-800">{bankData.weeklyHours.toFixed(1)}h</span>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3" />
        
        <div className={`p-4 rounded-xl ${
          isPositive 
            ? 'bg-gradient-to-br from-green-100/50 to-emerald-100/50 border border-green-300/50' 
            : 'bg-gradient-to-br from-red-100/50 to-pink-100/50 border border-red-300/50'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Saldo Atual:</span>
            <div className={`flex items-center font-bold text-xl ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(bankData.balance).toFixed(1)}h
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 glass backdrop-blur-md rounded-xl">
          <p className="text-xs text-gray-700 text-center font-medium">
            {isPositive 
              ? '✅ Você tem crédito de horas extras'
              : '⚠️ Você tem débito de horas'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
