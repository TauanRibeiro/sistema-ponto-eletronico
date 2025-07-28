# Sistema de Ponto Eletrônico

Um sistema completo de controle de ponto eletrônico desenvolvido com **Next.js 15**, **TypeScript**, **Prisma** e **NextAuth**.

## 🚀 Funcionalidades Principais

### 📱 Dashboard Moderno e Intuitivo
- Interface responsiva com design moderno e gradientes
- Dashboard personalizado com saudações dinâmicas
- Cards informativos com estatísticas em tempo real
- Navegação otimizada para desktop e mobile

### ⏰ Registro de Ponto
- **Registro com geolocalização** automática
- Interface visual moderna com relógio digital em tempo real
- Validação de entrada/saída com feedback visual
- Histórico completo de registros

### 👥 Gestão de Funcionários (Admin/Manager)
- **Adicionar funcionários** com modal interativo
- Edição e exclusão de funcionários
- Controle de perfis de acesso (Funcionário, Gerente, Admin)
- Campos personalizáveis (departamento, cargo, matrícula)

### 📊 Relatórios Avançados
- Geração de relatórios por período
- **Exportação em PDF e Excel**
- Filtros por funcionário e datas
- Relatórios detalhados com métricas

### 🏦 Banco de Horas
- Cálculo automático de horas trabalhadas vs esperadas
- Indicadores visuais de saldo (positivo/negativo)
- Resumo semanal e mensal
- Alertas de horas extras

### 📧 Sistema de Notificações
- Notificações em tempo real
- Sistema de email integrado (Gmail)
- Templates personalizados para diferentes eventos
- Histórico de notificações

### 📅 Gestão de Escalas
- Definição de horários de trabalho
- Escalas flexíveis por funcionário
- Configuração de intervalos
- Gestão de dias de trabalho

### 👤 Perfil do Usuário
- **Página de perfil funcional** com edição
- Informações pessoais e profissionais
- Upload de foto (planejado)
- Histórico pessoal

### ⚙️ Configurações Administrativas
- Painel de configurações para administradores
- Configuração de email
- Parâmetros do sistema
- Backup e manutenção

### 📋 Sistema de Solicitações
- Solicitações de correção de ponto
- Pedidos de férias e afastamentos
- Workflow de aprovação
- Histórico de solicitações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** com App Router
- **TypeScript** para tipagem forte
- **Tailwind CSS** para estilização
- **React Icons** para ícones modernos
- **date-fns** para manipulação de datas

### Backend
- **Next.js API Routes** 
- **Prisma ORM** com SQLite
- **NextAuth.js** para autenticação
- **bcrypt** para criptografia de senhas

### Funcionalidades Avançadas
- **jsPDF + autoTable** para geração de PDFs
- **XLSX** para exportação Excel
- **Nodemailer** para envio de emails
- **Geolocation API** para registro de localização

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd git-ponto-eletronico

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma generate
npx prisma db push

# Crie o usuário administrador
npx tsx scripts/create-admin.ts

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração de Email (Opcional)
No arquivo `.env`, configure:
```env
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

## 👤 Credenciais de Acesso

### Administrador
- **Email:** admin@exemplo.com
- **Senha:** admin.1156

### Funcionário (para testes)
- **Email:** funcionario@empresa.com  
- **Senha:** 123456

## 📱 Funcionalidades por Perfil

### 👨‍💼 Administrador
- ✅ Todas as funcionalidades
- ✅ Gestão completa de funcionários
- ✅ Configurações do sistema
- ✅ Relatórios avançados
- ✅ Gestão de escalas

### 👩‍💼 Gerente  
- ✅ Gestão de funcionários da equipe
- ✅ Relatórios da equipe
- ✅ Aprovação de solicitações
- ✅ Gestão de escalas

### 👤 Funcionário
- ✅ Registro de ponto
- ✅ Visualização do próprio histórico
- ✅ Banco de horas pessoal
- ✅ Solicitações
- ✅ Perfil pessoal

## 🎨 Design e UX

- **Interface moderna** com gradientes e sombras
- **Responsivo** para todos os dispositivos
- **Tema claro** com elementos visuais aprimorados
- **Feedback visual** em todas as ações
- **Loading states** e estados de erro
- **Animações suaves** e transições

## 🔧 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas do dashboard
│   ├── login/            # Página de login
│   └── register/         # Página de registro
├── components/            # Componentes React
├── lib/                  # Utilitários e configurações
└── prisma/               # Schema e migrações do banco

```

## 🔐 Segurança

- ✅ Autenticação com NextAuth.js
- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de sessão em todas as rotas
- ✅ Controle de acesso baseado em roles
- ✅ Validação de geolocalização
- ✅ Sanitização de dados de entrada

## 📊 Monitoramento

- ✅ Logs detalhados de ações
- ✅ Rastreamento de registros de ponto
- ✅ Histórico completo de mudanças
- ✅ Auditoria de acessos

## 🚀 Deploy e Produção

### Variáveis de Ambiente Necessárias
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="https://seu-dominio.com"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-de-app"
```

### Comandos de Deploy
```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start
```

## 📝 Roadmap Futuro

- [ ] App mobile com React Native
- [ ] Reconhecimento facial para registro
- [ ] Integração com APIs de RH
- [ ] Dashboard analytics avançado
- [ ] Modo offline com sincronização
- [ ] Relatórios customizáveis
- [ ] Multi-tenancy (múltiplas empresas)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Email: suporte@exemplo.com

---

**Sistema de Ponto Eletrônico** - Desenvolvido com ❤️ e tecnologias modernas
