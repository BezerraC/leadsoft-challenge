<h1 align="center">Desafio Full Stack LeadSoft - Missão Marte</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Em Progresso-f0ad4e?style=for-the-badge" alt="Status: Em Progresso"/>
</p>

---

## Índice

1.  [Sobre o Projeto](#-sobre-o-projeto)
2.  [Funcionalidades Principais](#-funcionalidades-principais)
3.  [Arquitetura e Conceitos Aplicados](#️-arquitetura-e-conceitos-aplicados)
4.  [Stack Tecnológica](#️-stack-tecnológica)
5.  [Como Rodar (Setup Local)](#-como-rodar-setup-local)

---

## Sobre o Projeto

Este projeto é uma solução completa para o desafio "Missão Marte" proposto pela LeadSoft. O objetivo foi construir uma aplicação web full stack que atende a uma série de requisitos técnicos e de negócio, servindo como uma plataforma de cadastro de candidatos para uma expedição espacial.

Mais do que apenas entregar funcionalidades, o foco deste projeto foi demonstrar a aplicação de conceitos de engenharia de software de alto nível, como **Arquitetura Hexagonal (DDD)**, **separação clara de responsabilidades (Frontend/Backend)** e **segurança ponta a ponta**.

O resultado é uma aplicação robusta, segura e escalável, composta por uma API RESTful em Express e um frontend moderno em Next.js.

---

## Funcionalidades Principais

A plataforma é dividida em duas grandes áreas, cada uma com seu próprio conjunto de funcionalidades:

### Área Pública

* **Landing Page e Galeria:** Uma página inicial renderizada no servidor (SSR com Next.js) que exibe a galeria pública de candidatos.
* **Cadastro de Candidato:** Formulário em `/register` que valida:
    * **Dimensões da Imagem:** Validação no cliente para aceitar *apenas* fotos 1080x1080px.
    * **Formato do CPF:** Validação no cliente e no servidor usando `cpf-cnpj-validator`.
    * **Unicidade:** Validação no backend para garantir que CPF e E-mail sejam únicos no banco.
* **Sistema de Comentários:** Usuários podem postar comentários em qualquer candidato da galeria.
* **Proteção contra Bots:** Os formulários de cadastro e comentários são protegidos via **Google reCAPTCHA v3**.

### Área Segura (Administração)

* **Login Seguro:** Rota em `/admin/login` protegida por **reCAPTCHA v3** e que gera um token **JWT (JSON Web Token)** na autenticação.
* **Dashboard Protegido:** O acesso ao painel (`/admin/dashboard`) é validado via token JWT.
* **Listagem Segura:** O dashboard consome uma rota de API segura (`/api/admin/candidates`) que retorna *todos* os dados dos candidatos, incluindo informações sensíveis (CPF, e-mail).
* **Visualização de Detalhes:** Um modal permite ao admin ver todos os dados de um candidato, sua foto e a lista de comentários.
* **Exclusão de Candidato:** O admin pode deletar um candidato. Esta ação remove o documento JSON e o *Attachment* (foto) do RavenDB em uma única transação.
* **Exclusão de Comentário:** O admin pode deletar comentários individuais de qualquer candidato diretamente pelo modal de detalhes.

---

## Arquitetura e Conceitos Aplicados

### 1. Separação Estrita (Frontend & Backend)

Para atender ao requisito de "Next.js com framework Express", optei por uma abordagem de **Monorepo (NPM Workspaces)** com duas aplicações completamente independentes:

* **`apps/api` (Backend - Express.js):**
    * Totalmente *stateless* e agnóstico em relação ao cliente.
    * Serve uma API RESTful.
    * Responsável por 100% da lógica de negócio, segurança e comunicação com o banco de dados.

* **`apps/web` (Frontend - Next.js):**
    * Atua puramente como um cliente.
    * Não contém *nenhuma* chave secreta ou lógica de persistência.
    * Usa uma mistura de **Server Components** (para SSR na galeria) e **Client Components** (para interatividade em formulários e modais).

### 2. Arquitetura Hexagonal (DDD) no Backend

O `apps/api` foi estruturado seguindo os princípios da Arquitetura Limpa/Hexagonal para garantir a separação de conceitos e alta testabilidade.

* **`src/domain` (O Núcleo):**
    * Contém a entidade `Candidate.js`.
    * É JavaScript puro, sem dependências externas (frameworks/bancos).
    * Define as regras de negócio intrínsecas (ex: `validate()` que checa o formato do CPF).

* **`src/application` (Casos de Uso):**
    * Orquestra a lógica de negócio. Ex: `RegisterCandidate.js`.
    * Define a lógica de unicidade (ex: "verificar se CPF já existe") antes de criar a entidade.
    * Depende apenas do *Domínio* e das *Interfaces* (portas).

* **`src/infrastructure` (O Mundo Externo):**
    * São os "Adaptadores".
    * `controllers/`: Lidam com HTTP (Express), traduzindo `req`/`res` para os casos de uso.
    * `repositories/`: Implementam as interfaces de persistência. `RavenCandidateRepository.js` é o único lugar que sabe falar "RavenDB".
    * `middlewares/`: Lidam com preocupações transversais, como `verifyAuth` (JWT) e `verifyRecaptcha`.

### 3. Persistência de Dados (RavenDB)

* **Anexos (Attachments):** As fotos não são salvas como Base64 no JSON. Elas são salvas como *Attachments* nativos do RavenDB, o que é muito mais performático para ler e escrever.
* **Modelagem de Comentários:** Para máxima eficiência de leitura, os comentários são modelados como um array aninhado dentro do próprio documento `Candidate`.

### 4. Segurança

* **Autenticação:** O admin recebe um `JWT` assinado com um `JWT_SECRET` do `.env`, com expiração de 8h.
* **Autorização:** Todas as rotas `/api/admin/*` (exceto `/login`) são protegidas pelo middleware `verifyAuth`, que valida o `Bearer Token`.
* **Proteção de Rota (Frontend):** O `RecaptchaProvider` é injetado no `layout.jsx` raiz, disponibilizando o serviço de forma global para a aplicação. O hook `useGoogleReCaptcha` é então chamado apenas nas rotas que exigem proteção (login, cadastro e comentários), garantindo a segurança no momento da submissão do formulário.

---

## Stack Tecnológica

| Categoria | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Monorepo** | **NPM Workspaces** | Gerenciamento simples e eficiente dos pacotes `apps/api` e `apps/web`. |
| **Backend** | **Node.js** | Ambiente de execução principal. |
| | **Express.js** | Framework minimalista para a API, conforme solicitado. |
| | **RavenDB (Node.js Client)**| Banco de dados NoSQL orientado a documentos, conforme solicitado. |
| | **JSON Web Token (JWT)** | Para autenticação *stateless* do painel de administração. |
| | **`cpf-cnpj-validator`** | Para validação de formato de CPF no Domínio. |
| **Frontend** | **Next.js 16 (App Router)** | Framework React principal, usado com Server Components (SSR) e Client Components. |
| | **React** | Biblioteca de UI base. |
| | **Tailwind CSS** | Para estilização rápida e consistente. |
| | **`react-google-recaptcha-v3`**| Cliente oficial para integração com reCAPTCHA v3. |
| **DevOps** | **Docker / Docker Compose** | Para subir e gerenciar a instância de desenvolvimento do RavenDB facilmente. |

---

## Como Rodar (Setup Local)

Siga estes passos para executar o projeto em sua máquina.

### Pré-requisitos

* **Node.js** (v20.x ou superior)
* **Docker** e **Docker Compose**
* Um **Editor de Código**
* **Chaves do Google reCAPTCHA v3** (Site Key e Secret Key) [Obtenha aqui](https://www.google.com/recaptcha/admin/)

### 1. Clone o Repositório

```bash
git clone https://github.com/BezerraC/leadsoft-challenge.git
cd leadsoft-challenge
```

### 2. Configure as Variáveis de Ambiente

Existem **dois** arquivos de ambiente que você precisa criar.

#### A. Backend (API)
Crie o arquivo `apps/api/.env`:

```bash
# Porta da API
PORT=3001

# Segredo para assinar os tokens JWT
JWT_SECRET=SEU_SEGREDO_JWT

# Chave SECRETA do Google reCAPTCHA v3
RECAPTCHA_SECRET=SUA_RECAPTCHA_SECRET_KEY
```

#### B. Frontend (WEB)

Crie o arquivo `apps/web/.env.local`:

```bash
# Chave do site do Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=SUA_RECAPTCHA_SITE_KEY_PUBLICA
```

### 3. Suba o Banco de Dados 

O RavenDB é executado via Docker.

```bash
# Na raiz do projeto, execute:
docker-compose up -d
```

- Após iniciar, acesse http://localhost:8080 no seu navegador.

- Crie um novo banco de dados. O nome padrão usado no código é `leadsoft-challenger` (você pode mudar isso em `apps/api/src/infrastructure/database/ravenStore.js`).

### 4. Instale as Dependências e Rode

Você precisará de dois terminais abertos.

#### Terminal 1: Rodar o Backend (API)

```bash
# Na raiz do projeto, instale todas as dependências do monorepo
npm install

# Inicie a API (apps/api)
npm run dev:api
```
- O servidor deve iniciar na http://localhost:3001.

- Verifique a saúde da API: http://localhost:3001/health

#### Terminal 2: Rodar o Frontend (WEB)

```bash
# No segundo terminal (na raiz do projeto)
# (Não precisa 'npm install' de novo)

# Inicie o Next.js (apps/web)
npm run dev:web
```

- O site estará disponível em http://localhost:3000.

### 5. Contas de Acesso
Pública: `http://localhost:3000`

Cadastro: `http://localhost:3000/register`

Admin Login: `http://localhost:3000/admin/login`

Usuário: `LeadIA@leadsoft.inf.br`

Senha: `Lead@1234`