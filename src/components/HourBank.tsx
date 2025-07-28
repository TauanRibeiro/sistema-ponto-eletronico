'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!bankData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaClock className="mr-2" />
          Banco de Horas
        </h3>
        <p className="text-gray-500">Dados não disponíveis</p>
      </div>
    );
  }

  const isPositive = bankData.balance >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaClock className="mr-2" />
        Banco de Horas
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Horas Trabalhadas (Mês):</span>
          <span className="font-semibold">{bankData.totalWorkedHours.toFixed(1)}h</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Horas Esperadas:</span>
          <span className="font-semibold">{bankData.expectedHours.toFixed(1)}h</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Horas na Semana:</span>
          <span className="font-semibold">{bankData.weeklyHours.toFixed(1)}h</span>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Saldo Atual:</span>
          <div className={`flex items-center font-bold text-lg ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {Math.abs(bankData.balance).toFixed(1)}h
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            {isPositive 
              ? 'Você tem crédito de horas extras'
              : 'Você tem débito de horas'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
