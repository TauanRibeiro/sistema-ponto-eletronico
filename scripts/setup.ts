import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Configurando sistema...');

  // Criar usuário admin padrão
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@sistema.com',
      password: hashedPassword,
      role: 'admin',
      department: 'TI',
      position: 'Administrador do Sistema',
      employeeId: 'ADM001'
    }
  });

  console.log('✅ Usuário admin criado:');
  console.log('📧 Email: admin@sistema.com');
  console.log('🔑 Senha: admin123');
  console.log('');

  // Criar usuário funcionário de exemplo
  const employeePassword = await bcrypt.hash('func123', 12);
  
  const employee = await prisma.user.upsert({
    where: { email: 'funcionario@sistema.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'funcionario@sistema.com',
      password: employeePassword,
      role: 'employee',
      department: 'Vendas',
      position: 'Vendedor',
      employeeId: 'EMP001'
    }
  });

  console.log('✅ Usuário funcionário criado:');
  console.log('📧 Email: funcionario@sistema.com');
  console.log('🔑 Senha: func123');
  console.log('');

  console.log('🎉 Sistema configurado com sucesso!');
  console.log('');
  console.log('🌐 Acesse: http://localhost:3000');
  console.log('📝 Faça login com as credenciais acima');
}

main()
  .catch((e) => {
    console.error('❌ Erro na configuração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
