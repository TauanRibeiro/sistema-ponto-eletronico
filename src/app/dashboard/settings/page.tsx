'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaCog, FaEnvelope, FaCalendarAlt, FaClock } from 'react-icons/fa';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [defaultWorkHours, setDefaultWorkHours] = useState(8);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [overtimeThreshold, setOvertimeThreshold] = useState(10);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailEnabled,
          defaultWorkHours,
          reminderTime,
          overtimeThreshold,
        }),
      });

      if (!response.ok) throw new Error('Falha ao salvar configurações');
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações');
    }
  };

  if (!session?.user || session.user.role !== 'admin') {
    return <div className="p-4">Acesso negado.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaCog className="mr-2" />
        Configurações do Sistema
      </h1>

      <div className="space-y-6">
        {/* Configurações de E-mail */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaEnvelope className="mr-2" />
            Notificações por E-mail
          </h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="mr-2"
              />
              Enviar notificações por e-mail
            </label>
            <div className="text-sm text-gray-600">
              Para configurar o e-mail, edite o arquivo .env com suas credenciais:
              <pre className="mt-2 p-2 bg-gray-100 rounded">
EMAIL_USER=seu-email@gmail.com{'\n'}
EMAIL_PASS=sua-senha-de-app
              </pre>
            </div>
          </div>
        </div>

        {/* Configurações de Horário */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaClock className="mr-2" />
            Configurações de Horário
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas de trabalho padrão por dia
              </label>
              <input
                type="number"
                value={defaultWorkHours}
                onChange={(e) => setDefaultWorkHours(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="1"
                max="24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limite para alerta de hora extra (horas)
              </label>
              <input
                type="number"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
                min="8"
                max="24"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Lembretes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2" />
            Lembretes Automáticos
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário para lembrete de ponto não registrado
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full md:w-auto border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
