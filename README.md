# Tsumi - aplicativo de clãs

Tsumi é um aplicativo de gamificação social construído com React Native e Expo, projetado para permitir que os usuários criem e gerenciem clãs, participem de missões e interajam em um mundo virtual. O aplicativo utiliza Supabase para seu backend, fornecendo autenticação, banco de dados em tempo real e armazenamento.

## Visão Geral dos Recursos

- **Autenticação de Usuário**: Sistema de login e registro seguro.
- **Perfis de Usuário**: Perfis de usuário personalizáveis com avatares, nomes de usuário e biografias.
- **Criação e Gerenciamento de Clãs**: Os usuários podem criar, personalizar e gerenciar seus próprios clãs.
- **Sistema de Missões**: Os clãs podem participar de missões para ganhar recompensas e aumentar sua reputação.
- **Territórios**: Os clãs podem conquistar e controlar territórios no mapa do jogo.
- **Interação Social**: Os usuários podem interagir entre si, participar de clãs e competir por poder e influência.

## Tech Stack

- **Frontend**: React Native com Expo
- **Backend**: Supabase (Autenticação, Banco de Dados, Armazenamento)
- **Estilo**: Tailwind CSS com NativeWind
- **Navegação**: Expo Router
- **Linguagem**: TypeScript

## Estrutura do Projeto

```
/
├── app/                  # Código-fonte principal do aplicativo
│   ├── (app)/            # Layouts e telas principais do aplicativo
│   ├── components/       # Componentes reutilizáveis
│   ├── context/          # Provedores de contexto React
│   ├── hooks/            # Hooks React personalizados
│   ├── lib/              # Módulos de biblioteca (Supabase, etc.)
│   └── utils/            # Funções utilitárias
├── assets/               # Imagens, fontes e outros ativos estáticos
├── components/           # Componentes de UI reutilizáveis
├── constants/            # Constantes e dados de configuração
├── supabase/             # Migrações e configurações do Supabase
├── package.json          # Dependências e scripts do projeto
└── tsconfig.json         # Configuração do TypeScript
```

## Começando

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI
- Yarn ou npm

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/tsumi_app.git
   cd tsumi_app
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   # ou
   yarn install
   ```

### Configuração do Backend (Supabase)

1. **Crie um projeto no Supabase**: Vá para [supabase.com](https://supabase.com) e crie um novo projeto.

2. **Configuração do Esquema do Banco de Dados**: Aplique as migrações do banco de dados local para configurar seu esquema do Supabase:

   ```bash
   npx supabase login
   npx supabase link --project-ref SEU_ID_DE_PROJETO
   npx supabase db push
   ```

3. **Configure as Variáveis de Ambiente**: Renomeie `env.example` para `.env` e adicione suas chaves de API do Supabase.

   ```env
   SUPABASE_URL=SUA_URL_DO_SUPABASE
   SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE
   ```

### Executando o Aplicativo

Para iniciar o servidor de desenvolvimento, execute um dos seguintes comandos:

- **Para iniciar em todas as plataformas (iOS, Android, Web):**

  ```bash
  npm start
  ```

- **Para iniciar especificamente para uma plataforma:**

  ```bash
  npm run android
  npm run ios
  npm run web
  ```

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento do Expo.
- `npm run android`: Inicia o aplicativo no emulador do Android ou em um dispositivo conectado.
- `npm run ios`: Inicia o aplicativo no simulador do iOS ou em um dispositivo conectado.
- `npm run web`: Inicia o aplicativo em um navegador da web.
- `npm run lint`: Executa o linter para verificar a qualidade do código.
- `npm run reset-project`: Redefine o cache do projeto.