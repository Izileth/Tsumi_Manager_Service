
# Tsumi - Aplicativo de Clãs

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-51-000020?logo=expo)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

**Tsumi** é um aplicativo de gamificação social construído com React Native e Expo, permitindo que os usuários criem e gerenciem clãs, participem de missões e interajam em um mundo virtual. O aplicativo utiliza Supabase como backend, fornecendo autenticação, banco de dados em tempo real e armazenamento de arquivos.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração do Backend](#configuração-do-backend)
  - [Executando o Aplicativo](#executando-o-aplicativo)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)

## Visão Geral

O Tsumi foi projetado para ser uma plataforma imersiva onde os jogadores podem formar alianças (clãs), competir por territórios, completar missões para ganhar recompensas e fortalecer seu clã. Com um sistema de perfil personalizável e interação social, o Tsumi visa criar uma comunidade engajada e dinâmica.

## Tecnologias Utilizadas

- **Frontend**: [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Backend**: [Supabase](https://supabase.com/) (Autenticação, Banco de Dados, Armazenamento)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com [NativeWind](https://www.nativewind.dev/)
- **Navegação**: [Expo Router](https://expo.github.io/router/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## Funcionalidades

- **Autenticação Segura**: Sistema completo de registro e login de usuários.
- **Perfis de Usuário**: Perfis personalizáveis com avatar, biografia e links sociais.
- **Criação e Gestão de Clãs**: Crie, edite e gerencie clãs, incluindo emblemas e membros.
- **Sistema de Missões**: Participe de missões para ganhar recompensas e aumentar a reputação do seu clã.
- **Mapa de Territórios**: Visualize e conquiste territórios em um mapa interativo.
- **Interação Social**: Explore outros clãs e perfis, recrute novos membros e compita pelo poder e influência.

## Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- [Supabase CLI](https://supabase.com/docs/guides/cli): `npm install supabase --save-dev`
- Gerenciador de pacotes: `npm` ou `yarn`

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd tsumi_app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Configuração do Backend

1.  **Crie um projeto no Supabase**: Acesse [supabase.com](https://supabase.com) e crie um novo projeto.

2.  **Configure o Schema do Banco de Dados**: Vincule seu projeto local ao Supabase e aplique as migrações.
    ```bash
    npx supabase login
    npx supabase link --project-ref SEU_ID_DE_PROJETO
    npx supabase db push
    ```
    *Substitua `SEU_ID_DE_PROJETO` pelo ID do seu projeto no Supabase.*

3.  **Configure as Variáveis de Ambiente**: Crie um arquivo `.env` na raiz do projeto e adicione suas chaves de API do Supabase.
    ```env
    SUPABASE_URL=SUA_URL_DO_SUPABASE
    SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE
    ```
    *Você pode encontrar essas chaves nas configurações de API do seu projeto Supabase.*

### Executando o Aplicativo

Para iniciar o servidor de desenvolvimento, use um dos seguintes comandos:

- **Para iniciar em todas as plataformas (iOS, Android, Web):**
  ```bash
  npm start
  ```
  *Após iniciar, escaneie o QR code com o aplicativo Expo Go ou pressione `a` para Android e `i` para iOS.*

- **Para iniciar em uma plataforma específica:**
  ```bash
  npm run android
  npm run ios
  npm run web
  ```

## Estrutura do Projeto

```
/
├── app/              # Código-fonte principal (Expo Router)
│   ├── (app)/        # Layouts e telas protegidas
│   ├── components/   # Componentes específicos de telas
│   ├── context/      # Provedores de contexto (Auth, Profile)
│   ├── hooks/        # Hooks React personalizados
│   ├── lib/          # Módulos de bibliotecas (Supabase)
│   └── utils/        # Funções utilitárias
├── assets/           # Ativos estáticos (imagens, fontes)
├── components/       # Componentes de UI globais e reutilizáveis
├── constants/        # Constantes e dados de configuração
├── supabase/         # Migrações e configurações do Supabase
├── package.json      # Dependências e scripts
└── tsconfig.json     # Configurações do TypeScript
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento do Expo.
- `npm run android`: Inicia o app no emulador/dispositivo Android.
- `npm run ios`: Inicia o app no simulador/dispositivo iOS.
- `npm run web`: Inicia o app em um navegador web.
- `npm run lint`: Executa o linter para análise estática do código.
- `npm run reset-project`: Reseta o cache do projeto.
