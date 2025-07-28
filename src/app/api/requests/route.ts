import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';

// GET: Listar solicitações
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const isManager = session.user.role === 'manager' || session.user.role === 'admin';
    
    // Gestores veem todas as solicitações, funcionários veem apenas as suas
    const requests = await prisma.request.findMany({
      where: isManager 
        ? {} 
        : { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar solicitações' },
      { status: 500 }
    );
  }
}

// POST: Criar nova solicitação
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { type, startDate, endDate, reason, attachment } = data;

    // Validações básicas
    if (!type || !startDate || !reason) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Se for solicitação de férias, precisa de data final
    if (type === 'vacation' && !endDate) {
      return NextResponse.json(
        { error: 'Data final obrigatória para férias' },
        { status: 400 }
      );
    }

    const newRequest = await prisma.request.create({
      data: {
        type,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        reason,
        attachment,
        userId: session.user.id,
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

    // Criar notificação para os gestores
    const managers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'manager' },
          { role: 'admin' },
        ],
      },
    });

    // Criar notificações em paralelo
    await Promise.all(managers.map(manager => 
      prisma.notification.create({
        data: {
          userId: manager.id,
          title: 'Nova Solicitação',
          message: `${session.user.name} fez uma nova solicitação de ${type}`,
          type: 'info',
        },
      })
    ));

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar solicitação' },
      { status: 500 }
    );
  }
}
