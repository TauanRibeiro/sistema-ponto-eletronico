import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminForProduction() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.email);
      return;
    }

    // Criar admin padrão
    const hashedPassword = await bcrypt.hash('admin.1156', 10);
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador do Sistema',
        email: 'admin@exemplo.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✅ Admin criado com sucesso para produção:', admin.email);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  createAdminForProduction();
}

export default createAdminForProduction;
