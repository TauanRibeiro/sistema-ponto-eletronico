import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@exemplo.com',
        password: hashedPassword,
        role: 'manager',
      },
    });

    console.log('Usuário administrador criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
