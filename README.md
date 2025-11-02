# Calculadora do Primeiro Milhão

Aplicação Full Stack para simulação de investimentos de longo prazo, utilizando cálculo de juros compostos com aportes mensais, autenticação JWT e banco de dados PostgreSQL.

## Stack Técnica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (ícones)

### Backend
- **Node.js**
- **Next.js API Routes**
- **TypeScript**

### Banco de Dados
- **PostgreSQL** (Neon.tech)
- **Prisma ORM**

### Autenticação
- **JWT (jsonwebtoken)**
- **bcryptjs** (hash de senhas)
---

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

---

## Instalação e Configuração

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/BrenoAfonso/calculadora-primeiro-milhao.git
cd calculadora-primeiro-milhao
```

### 2️⃣ Instale as dependências
```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edite o arquivo `.env` e adicione:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui-mude-para-producao"
```

> ⚠️ **Importante**: Em produção, use uma chave JWT forte e segura!

### 4️⃣ Configure o banco de dados

Execute as migrations do Prisma:
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## Estrutura do Projeto
```
CALCULADORA-PRIMEIRO-MILHO/
├── app/
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── cadastro/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routs 
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── signup/
│   │   │       └── route.ts
│   │   │
│   │   ├── calculations/         
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # DELETE
│   │   │   └── route.ts          # GET, POST 
│   │
│   ├── calculator/               # Página princial da calculadora
│   │   └── page.tsx
│   │
│   ├── history/                  # Página de historico de cálculos
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Página inicial
│
├── lib/                          
│   ├── auth.ts                   # Funções de autenticação (JWT, hash)
│   └── prisma.ts                 # Cliente Prisma
│
├── prisma/
│   ├── schema.prisma             # Modelo do banco 
│   └── migrations                
│
├── public/
│   └── favicon.ico
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Funcionalidades

### ✅ Autenticação
- [x] Cadastro de usuário (email + senha)
- [x] Login com validação
- [x] Persistência de sessão via JWT
- [x] Logout

### ✅ Calculadora
- [x] Inputs: Aporte Inicial, Aporte Mensal, Taxa de Juros
- [x] Cálculo de juros compostos (fórmula: `Vt = (Vt-1 + Am) × (1 + R)`)
- [x] Tabela detalhada mês a mês até R$ 1.000.000
- [x] 6 colunas conforme especificação
- [x] Salvar simulação no banco

### ✅ Histórico (CRUD)
- [x] Listar todos os cálculos do usuário
- [x] Nomear cálculos
- [x] Deletar cálculos
- [x] Visualização em cards responsivos

### ✅ Banco de Dados
- [x] Prisma ORM com snake_case
- [x] Relação 1:N entre User e Calculation
- [x] Migração de SQLite → PostgreSQL (Neon.tech) para uso em produção

---

## Fórmula de Cálculo

A aplicação utiliza a fórmula de **juros compostos com aportes mensais**:
```
Vt = (Vt-1 + Am) × (1 + R)
```

Onde:
- **Vt** = Valor total acumulado no mês atual
- **Vt-1** = Valor total acumulado no mês anterior
- **Am** = Aporte mensal fixo
- **R** = Taxa de juros mensal (em decimal, ex: 0.8% = 0.008)

---

## Schema do Banco de Dados
```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  password_hash String
  created_at    DateTime      @default(now())
  calculations  Calculation[]
  
  @@map("users")
}

model Calculation {
  id                    String   @id @default(uuid())
  user_id               String
  calculation_name      String?
  calculation_date      DateTime @default(now())
  initial_contribution  Float
  monthly_contribution  Float
  monthly_rate          Float
  months_to_reach_goal  Int
  final_amount          Float
  total_contributed     Float
  total_interest        Float
  
  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@index([user_id])
  @@map("calculations")
}
```
## Testando a Aplicação

1. Acesse `http://localhost:3000/login`
2. Crie uma conta nova
3. Será redirecionado para `/calculator`
4. Faça uma simulação com os valores sugeridos (ou personalizados)
5. Salve o cálculo com um nome
6. Clique em "Ver Histórico" para visualizar
7. Teste a exclusão de um cálculo
8. Faça logout e login novamente para verificar persistência
---

## Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start

# Prisma Studio (visualizar banco)
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset
```

---

## Troubleshooting
### Erro: "Prisma Client não encontrado"
```bash
npx prisma generate
```

### Erro: "Cannot find module"
```bash
npm install
```

### Banco de dados corrompido
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
```

---

## Contato 
LinkedIn: [linkedin.com/in/Breno-afonso](https://linkedin.com/in/Breno-afonso)  
GitHub: [@BrenoAfonso](https://github.com/BrenoAfonso)

---

## Licença
Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.