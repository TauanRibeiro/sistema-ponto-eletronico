import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar o banco de dados
    await prisma.timeRecord.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin.1156', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@exemplo.com',
        password: hashedPassword,
        role: 'manager',
      },
    });

    console.log('Usuário admin criado:', admin);
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
