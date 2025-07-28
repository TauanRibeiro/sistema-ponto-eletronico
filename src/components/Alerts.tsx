'use client';

import { useEffect, useState, useCallback } from 'react';
import { differenceInHours } from 'date-fns';

type Alert = {
  type: 'warning' | 'info' | 'error';
  message: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastEntry, setLastEntry] = useState<Date | null>(null);

  const checkAlerts = useCallback(async () => {
      try {
        const response = await fetch('/api/time-records');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        
        const data = await response.json();
        const newAlerts: Alert[] = [];
        
        // Encontra o último registro
        const allRecords = (Object.values(data) as Record<string, unknown>[][])
          .flat()
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
            new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
          );

        if (allRecords.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lastRecord: any = allRecords[0];
          
          // Se o último registro foi uma entrada
          if (lastRecord.type === 'entry') {
            const entryTime = new Date(lastRecord.createdAt);
            setLastEntry(entryTime);
            
            const hoursWorking = differenceInHours(new Date(), entryTime);
            
            if (hoursWorking >= 10) {
              newAlerts.push({
                type: 'error',
                message: 'Você está trabalhando há mais de 10 horas! Registre sua saída.'
              });
            } else if (hoursWorking >= 8) {
              newAlerts.push({
                type: 'warning',
                message: 'Você já completou 8 horas de trabalho.'
              });
            }
          } else {
            setLastEntry(null);
          }
        }

        // Verifica se é um dia útil e se já registrou entrada
        const now = new Date();
        if (now.getHours() >= 9 && now.getHours() < 18 && 
            now.getDay() !== 0 && now.getDay() !== 6 && !lastEntry) {
          newAlerts.push({
            type: 'info',
            message: 'Não se esqueça de registrar sua entrada!'
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error('Erro ao verificar alertas:', error);
      }
    }, []);

  useEffect(() => {
    checkAlerts();
    // Verifica alertas a cada 5 minutos
    const interval = setInterval(checkAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAlerts]);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            alert.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : alert.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <p>{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
