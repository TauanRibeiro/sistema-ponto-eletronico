# Guia de Deploy - Sistema de Ponto Eletrônico

## 🚀 Deploy no Vercel (RECOMENDADO)

### Pré-requisitos
- Conta no GitHub
- Conta no Vercel (gratuita)

### Passo a Passo

#### 1. Preparar o Repositório
```bash
# Inicializar git (se ainda não fez)
git init
git add .
git commit -m "Sistema de Ponto Eletrônico completo"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU_USUARIO/ponto-eletronico.git
git branch -M main
git push -u origin main
```

#### 2. Deploy no Vercel
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:

**Variáveis Obrigatórias:**
```env
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=sua-chave-secreta-aqui-minimum-32-chars
NEXTAUTH_URL=https://seu-app.vercel.app
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

#### 3. Configurar Domínio (Opcional)
- No painel do Vercel, vá em Settings > Domains
- Adicione seu domínio personalizado

## 🗄️ Opções de Banco de Dados

### Para SQLite (Desenvolvimento/Teste)
```env
DATABASE_URL=file:./dev.db
```

### Para PostgreSQL (Produção - PlanetScale)
1. Crie conta em https://planetscale.com
2. Crie database gratuito
3. Use a connection string:
```env
DATABASE_URL=mysql://user:pass@host/database?sslaccept=strict
```

### Para PostgreSQL (Produção - Supabase)
1. Crie conta em https://supabase.com
2. Crie projeto gratuito
3. Use a connection string do projeto

## 🔧 Configurações Adicionais

### CORS e Domínios
```javascript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}
```

### Build Optimization
```json
// package.json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma db push"
  }
}
```

## 📧 Configuração de Email

### Gmail Setup
1. Ative autenticação de 2 fatores
2. Gere senha de app em: https://myaccount.google.com/apppasswords
3. Use a senha de app na variável EMAIL_PASS

## 🚀 URLs Importantes

- **Vercel:** https://vercel.com
- **PlanetScale:** https://planetscale.com (MySQL gratuito)
- **Supabase:** https://supabase.com (PostgreSQL gratuito)
- **Railway:** https://railway.app (Deploy completo)

## 📋 Checklist Final

- [ ] Repositório no GitHub criado
- [ ] Variáveis de ambiente configuradas
- [ ] Build executando sem erros
- [ ] Database schema aplicado
- [ ] Email configurado (opcional)
- [ ] SSL ativo (automático no Vercel)
- [ ] Domínio configurado (opcional)

## 🔍 Troubleshooting

### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build
```

### Erro de Database
```bash
# Regenerar Prisma client
npx prisma generate
npx prisma db push
```

### 403 Forbidden
- Verificar NEXTAUTH_URL
- Verificar NEXTAUTH_SECRET (mínimo 32 caracteres)

## 🎯 Performance Tips

- Use cache estático para assets
- Otimize imagens com next/image
- Configure CDN (automático no Vercel)
- Use compressão gzip (automático)

---

**Seu sistema estará online em poucos minutos! 🚀**
