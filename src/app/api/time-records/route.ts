import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const timeRecords = await prisma.timeRecord.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30, // últimos 30 registros
    });

    // Agrupar registros por dia
    const groupedRecords = timeRecords.reduce((acc, record) => {
      const date = new Date(record.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json(groupedRecords);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar registros' },
      { status: 500 }
    );
  }
}
