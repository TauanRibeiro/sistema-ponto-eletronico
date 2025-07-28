import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';
import { differenceInMinutes } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const employeeId = searchParams.get('employeeId');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Datas de início e fim são obrigatórias' },
        { status: 400 }
      );
    }

    const whereClause: any = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59'),
      },
    };

    if (employeeId) {
      whereClause.userId = employeeId;
    }

    const records = await prisma.timeRecord.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Processar os dados para o relatório
    const reportData = processRecordsForReport(records);

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}

function processRecordsForReport(records: any[]) {
  const dailyData: { [key: string]: any } = {};

  records.forEach(record => {
    const date = new Date(record.createdAt).toLocaleDateString('pt-BR');
    const key = `${record.userId}-${date}`;

    if (!dailyData[key]) {
      dailyData[key] = {
        name: record.user.name,
        date,
        entries: [],
        exits: [],
      };
    }

    if (record.type === 'entry') {
      dailyData[key].entries.push(new Date(record.createdAt));
    } else {
      dailyData[key].exits.push(new Date(record.createdAt));
    }
  });

  return Object.values(dailyData).map(day => {
    let totalMinutes = 0;
    const entries = day.entries.sort((a: Date, b: Date) => a.getTime() - b.getTime());
    const exits = day.exits.sort((a: Date, b: Date) => a.getTime() - b.getTime());

    for (let i = 0; i < Math.min(entries.length, exits.length); i++) {
      totalMinutes += differenceInMinutes(exits[i], entries[i]);
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      name: day.name,
      date: day.date,
      entry: entries.length > 0 ? entries[0].toLocaleTimeString('pt-BR') : '-',
      exit: exits.length > 0 ? exits[exits.length - 1].toLocaleTimeString('pt-BR') : '-',
      totalHours: `${hours}h ${minutes}min`,
    };
  });
}
