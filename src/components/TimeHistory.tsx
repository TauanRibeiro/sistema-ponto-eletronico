'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaClock } from 'react-icons/fa';

type TimeRecord = {
  id: string;
  type: 'entry' | 'exit';
  createdAt: string;
  latitude: number;
  longitude: number;
};

type GroupedRecords = Record<string, TimeRecord[]>;

export default function TimeHistory() {
  const [records, setRecords] = useState<GroupedRecords>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/time-records');
        if (!response.ok) {
          throw new Error('Erro ao buscar registros');
        }
        const data = await response.json();
        setRecords(data);
      } catch (err) {
        setError('Erro ao carregar histórico');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div className="text-center mt-4 text-gray-700 font-medium">Carregando histórico...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(records).map(([date, dayRecords]) => (
        <div key={date} className="glass-card p-4 rounded-xl shadow-md fade-in">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
            <FaClock className="mr-2 text-blue-600" />
            {format(parseISO(dayRecords[0].createdAt), "EEEE, d 'de' MMMM", {
              locale: ptBR,
            })}
          </h3>
          <div className="space-y-2">
            {dayRecords.map((record) => (
              <div
                key={record.id}
                className="flex justify-between items-center text-sm p-2 glass backdrop-blur-md rounded-lg"
              >
                <span
                  className={`font-semibold ${
                    record.type === 'entry'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {record.type === 'entry' ? '➡️ Entrada' : '⬅️ Saída'}
                </span>
                <span className="font-mono font-bold text-gray-800">
                  {format(parseISO(record.createdAt), 'HH:mm:ss')}
                </span>
              </div>
            ))}
          </div>
          {dayRecords.length >= 2 && (
            <div className="mt-3 text-sm text-gray-700 border-t border-white/30 pt-3 glass backdrop-blur-md p-2 rounded-lg">
              <span className="font-bold">Total do dia: </span>
              <span className="font-semibold text-blue-600">{calculateDayHours(dayRecords)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function calculateDayHours(records: TimeRecord[]) {
  let totalMinutes = 0;
  let lastEntry: Date | null = null;

  records
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .forEach((record) => {
      if (record.type === 'entry') {
        lastEntry = new Date(record.createdAt);
      } else if (record.type === 'exit' && lastEntry) {
        const exit = new Date(record.createdAt);
        totalMinutes += (exit.getTime() - lastEntry.getTime()) / (1000 * 60);
        lastEntry = null;
      }
    });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  return `${hours}h ${minutes}min`;
}
