import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: Listar funcionários
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar funcionários' },
      { status: 500 }
    );
  }
}

// POST: Criar novo funcionário
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'manager' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
        const { name, email, password, role } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'employee',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar funcionário' },
      { status: 500 }
    );
  }
}
