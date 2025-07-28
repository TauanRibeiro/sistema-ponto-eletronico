'use client';

import { useEffect, useState } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type WorkSummary = {
  weeklyHours: number;
  monthlyHours: number;
  averageDailyHours: number;
  punctualityRate: number;
};

export default function WorkSummary() {
  const [summary, setSummary] = useState<WorkSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/time-records');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        
        const data = await response.json();
        const records = Object.values(data).flat();
        
        // Cálculos do resumo
        const now = new Date();
        const weekStart = startOfWeek(now, { locale: ptBR });
        const weekEnd = endOfWeek(now, { locale: ptBR });
        
        let weeklyMinutes = 0;
        let monthlyMinutes = 0;
        let totalDays = new Set();
        let totalMinutes = 0;
        let punctualCount = 0;
        let totalEntries = 0;

        Object.entries(data).forEach(([date, dayRecords]: [string, any[]]) => {
          const recordDate = new Date(dayRecords[0].createdAt);
          let dayMinutes = 0;
          let lastEntry: Date | null = null;

          dayRecords.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ).forEach((record: any) => {
            const recordTime = new Date(record.createdAt);
            
            if (record.type === 'entry') {
              lastEntry = recordTime;
              totalEntries++;
              // Considera pontual se entrar até 9:10
              if (recordTime.getHours() < 9 || 
                 (recordTime.getHours() === 9 && recordTime.getMinutes() <= 10)) {
                punctualCount++;
              }
            } else if (record.type === 'exit' && lastEntry) {
              const minutes = differenceInMinutes(recordTime, lastEntry);
              dayMinutes += minutes;
              
              if (recordTime >= weekStart && recordTime <= weekEnd) {
                weeklyMinutes += minutes;
              }
              
              if (recordTime.getMonth() === now.getMonth()) {
                monthlyMinutes += minutes;
              }
              
              lastEntry = null;
            }
          });

          if (dayMinutes > 0) {
            totalDays.add(date);
            totalMinutes += dayMinutes;
          }
        });

        setSummary({
          weeklyHours: Math.round(weeklyMinutes / 60 * 10) / 10,
          monthlyHours: Math.round(monthlyMinutes / 60 * 10) / 10,
          averageDailyHours: totalDays.size ? Math.round((totalMinutes / totalDays.size) / 60 * 10) / 10 : 0,
          punctualityRate: totalEntries ? Math.round((punctualCount / totalEntries) * 100) : 0
        });
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchSummary, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center p-4">Carregando resumo...</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
      <div className="stat">
        <h3 className="text-lg font-semibold text-gray-600">Horas na Semana</h3>
        <p className="text-2xl font-bold text-blue-600">{summary.weeklyHours}h</p>
      </div>
      <div className="stat">
        <h3 className="text-lg font-semibold text-gray-600">Horas no Mês</h3>
        <p className="text-2xl font-bold text-green-600">{summary.monthlyHours}h</p>
      </div>
      <div className="stat">
        <h3 className="text-lg font-semibold text-gray-600">Média Diária</h3>
        <p className="text-2xl font-bold text-purple-600">{summary.averageDailyHours}h</p>
      </div>
      <div className="stat">
        <h3 className="text-lg font-semibold text-gray-600">Taxa de Pontualidade</h3>
        <p className="text-2xl font-bold text-orange-600">{summary.punctualityRate}%</p>
      </div>
    </div>
  );
}
