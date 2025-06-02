# 🚀 RocketLib - Backend

O backend da **RocketLib** é uma API desenvolvida com **NestJS**, **Prisma** e **SQLite**, responsável por gerenciar o catálogo de livros, reviews, carrinho de compras e pedidos. Possui como diferencial a possibilidade de criação automática de um carrinho com o auxílio de uma LLM.

## 📦 Funcionalidades principais

- CRUD de livros
- Criação e visualização de reviews para um determinado livro
- Carrinho de compras com manipulação de itens
- Criação de um carrinho automático com base nas suas preferências de leitura e nos livros do banco
- Finalização de pedidos
- Relacionamentos entre livros, reviews, pedidos e itens do carrinho

---

## ⚙️ Tecnologias utilizadas

- **NestJS** – framework Node.js para APIs robustas
- **Prisma** – ORM para acesso ao banco de dados
- **SQLite** – banco de dados leve para desenvolvimento local
- **Groq API** – geração automática do carrinho via IA
- **TypeScript** - linguagem utilizada
- **pnpm** – gerenciador de pacotes

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/lumendesp/RocketLab-Backend.git
cd RocketLab-Backend
```

### 2. Certifique-se de que você tem o pnpm instalado. Se não tiver, instale com:

```bash
npm install -g pnpm
```

### 3. Depois, instale os pacotes do projeto:

```bash
pnpm install
```

### 4. Configure a variável de ambiente:
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo (você pode copiar o .env.example):

VITE_GROQ_API_KEY=sua_chave_da_api_groq_aqui

🔐 A chave da API Groq é necessária para gerar o carrinho automático ao enviar suas preferências de leitura. Para obter a sua chave, basta criar uma conta no Groq: https://console.groq.com/keys

### 5. Configure o banco de dados:

```bash
pnpm prisma migrate dev --name init
```

### 6. Popule o banco com livros iniciais:

```bash
npx tsx prisma/seed.ts
```

### 7. Se quiser apagar os dados e recomeçar:

```bash
npx tsx prisma/clear.ts
```

### 8. Rode o servidor localmente:

```bash
pnpm start:dev
```

## 📓 Documentação da API

A documentação interativa (Swagger) estará disponível após rodar o projeto, acessando:

👉 [http://localhost:3000/api](http://localhost:3000/api)

## 🧪 Rodar testes

```bash
pnpm test
```

O projeto conta com 47 casos de testes unitários

A cobertura dos testes pode ser verificada em:

```bash
pnpm test:cov
```

Depois, navegue em: coverage/lcov-report/index.html

### Boa! Agora é só abrir no localhost e navegar pelo projeto 🚀
