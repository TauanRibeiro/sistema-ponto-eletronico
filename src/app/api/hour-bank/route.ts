import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';
import { differenceInMinutes, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Segunda-feira
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Buscar registros da semana atual
    const weekRecords = await prisma.timeRecord.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Buscar registros do mês atual
    const monthRecords = await prisma.timeRecord.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Buscar horário de trabalho do usuário
    const workSchedule = await prisma.workSchedule.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Configuração padrão: 8h/dia, 5 dias/semana = 40h/semana
    const defaultHoursPerDay = 8;
    const defaultWorkDays = [1, 2, 3, 4, 5]; // Segunda a sexta
    
    const hoursPerDay = workSchedule?.workHours || defaultHoursPerDay;
    const workDays = workSchedule?.workDays ? 
      workSchedule.workDays.split(',').map(Number) : defaultWorkDays;

    // Calcular horas trabalhadas na semana
    const weeklyHours = calculateWorkedHours(weekRecords);
    
    // Calcular horas trabalhadas no mês
    const monthlyHours = calculateWorkedHours(monthRecords);
    
    // Calcular dias úteis do mês até hoje
    const workDaysInMonth = calculateWorkDaysInPeriod(monthStart, now, workDays);
    const expectedHours = workDaysInMonth * hoursPerDay;
    
    // Calcular saldo
    const balance = monthlyHours - expectedHours;

    return NextResponse.json({
      totalWorkedHours: monthlyHours,
      expectedHours,
      balance,
      weeklyHours,
      monthlyBalance: balance,
    });
  } catch (error) {
    console.error('Erro ao calcular banco de horas:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular banco de horas' },
      { status: 500 }
    );
  }
}

function calculateWorkedHours(records: { createdAt: string | Date; type: string }[]): number {
  const dailyData: { [key: string]: { entries: Date[], exits: Date[] } } = {};

  // Agrupar por dia
  records.forEach(record => {
    const date = new Date(record.createdAt).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = { entries: [], exits: [] };
    }

    if (record.type === 'entry') {
      dailyData[date].entries.push(new Date(record.createdAt));
    } else {
      dailyData[date].exits.push(new Date(record.createdAt));
    }
  });

  let totalMinutes = 0;

  // Calcular horas para cada dia
  Object.values(dailyData).forEach(day => {
    const entries = day.entries.sort((a, b) => a.getTime() - b.getTime());
    const exits = day.exits.sort((a, b) => a.getTime() - b.getTime());

    for (let i = 0; i < Math.min(entries.length, exits.length); i++) {
      totalMinutes += differenceInMinutes(exits[i], entries[i]);
    }
  });

  return totalMinutes / 60; // Converter para horas
}

function calculateWorkDaysInPeriod(start: Date, end: Date, workDays: number[]): number {
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    if (workDays.includes(current.getDay())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}
