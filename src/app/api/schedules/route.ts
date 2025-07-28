import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const schedules = await prisma.workSchedule.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Erro ao listar escalas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar escalas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { 
      userId, 
      workDays, 
      workHours, 
      startTime, 
      endTime, 
      breakStart, 
      breakEnd, 
      flexibleHours 
    } = data;

    // Verificar se já existe uma escala para este usuário
    const existingSchedule = await prisma.workSchedule.findUnique({
      where: { userId },
    });

    if (existingSchedule) {
      // Atualizar escala existente
      const updatedSchedule = await prisma.workSchedule.update({
        where: { userId },
        data: {
          workDays,
          workHours,
          startTime,
          endTime,
          breakStart,
          breakEnd,
          flexibleHours,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(updatedSchedule);
    } else {
      // Criar nova escala
      const newSchedule = await prisma.workSchedule.create({
        data: {
          userId,
          workDays,
          workHours,
          startTime,
          endTime,
          breakStart,
          breakEnd,
          flexibleHours,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(newSchedule);
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar escala:', error);
    return NextResponse.json(
      { error: 'Erro ao criar/atualizar escala' },
      { status: 500 }
    );
  }
}
