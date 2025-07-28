import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Não permitir exclusão do próprio usuário
    if (user.id === session.user.id) {
      return NextResponse.json({ error: 'Não é possível excluir seu próprio usuário' }, { status: 400 });
    }

    // Excluir registros relacionados primeiro (devido às foreign keys)
    await prisma.timeRecord.deleteMany({
      where: { userId: id },
    });

    await prisma.request.deleteMany({
      where: { userId: id },
    });

    await prisma.notification.deleteMany({
      where: { userId: id },
    });

    await prisma.workSchedule.deleteMany({
      where: { userId: id },
    });

    // Excluir o usuário
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário' },
      { status: 500 }
    );
  }
}
