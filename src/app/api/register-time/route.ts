import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error('Sessão sem ID do usuário:', session);
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    const data = await request.json();
    const { type, latitude, longitude } = data;

    if (!type || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const userId = session.user.id;

    const timeRecord = await prisma.timeRecord.create({
      data: {
        type,
        userId: userId,
        latitude,
        longitude,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    });

    return NextResponse.json(timeRecord);
  } catch (error) {
    console.error('Erro ao registrar ponto:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar ponto' },
      { status: 500 }
    );
  }
}
