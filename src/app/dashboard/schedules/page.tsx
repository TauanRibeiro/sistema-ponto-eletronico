'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

type WorkSchedule = {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  workDays: string;
  workHours: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  flexibleHours: boolean;
};

export default function SchedulesPage() {
  const { data: session } = useSession();
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) throw new Error('Falha ao carregar escalas');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWorkDays = (workDays: string) => {
    const days = workDays.split(',').map(Number);
    return days.map(day => dayNames[day]).join(', ');
  };

  if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
    return <div className="p-4">Acesso negado.</div>;
  }

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaCalendarAlt className="mr-2" />
          Gestão de Escalas
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Nova Escala
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Funcionário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dias de Trabalho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horas/Dia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intervalo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {schedule.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatWorkDays(schedule.workDays)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.startTime} - {schedule.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.workHours}h
                  {schedule.flexibleHours && (
                    <span className="ml-1 text-blue-500">(Flexível)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.breakStart && schedule.breakEnd 
                    ? `${schedule.breakStart} - ${schedule.breakEnd}`
                    : 'Sem intervalo'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <FaTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma escala cadastrada
        </div>
      )}

      {/* Modal para criar/editar escala será implementado aqui */}
    </div>
  );
}
