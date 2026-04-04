# VFit

App web de academia com Next.js App Router, Firebase Authentication e Cloud Firestore.

## Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Firebase Auth
- Cloud Firestore
- React Hook Form + Zod

## Escopo atual

O projeto foi ajustado para funcionar sem Firebase Storage.

Isso significa:

- sem upload de imagens
- sem armazenamento de arquivos
- sem dependencia de Storage no fluxo principal
- foco apenas em autenticacao e dados no Firestore

## Setup local

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env.local` a partir de `.env.example`.

Preencha com os dados do seu projeto Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Observacao:

- `NEXT_PUBLIC_...` no Firebase Web nao sao segredos de servidor, mas ainda e melhor nao versionar valores reais do seu projeto
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` pode permanecer no `.env`, mas o app nao depende mais de Storage

3. Rode o projeto:

```bash
npm run dev
```

4. Valide o projeto:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Regras Firebase no projeto

Arquivos atuais:

- `firestore.rules`
- `firebase.json`

## O que alterar no Firebase

Voce precisa configurar isso no seu projeto Firebase.

### 1. Authentication

No console do Firebase:

1. Abra `Build > Authentication`
2. Clique em `Get started` se ainda nao estiver ativo
3. Em `Sign-in method`, habilite `Email/Password`
4. Salve

### 2. Firestore Database

No console do Firebase:

1. Abra `Build > Firestore Database`
2. Clique em `Create database` se ainda nao existir
3. Escolha um local
4. Depois da criacao, abra a aba `Rules`
5. Substitua o conteudo pelas regras de `firestore.rules`

Conteudo esperado:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /workouts/{workoutId} {
        allow read, write: if isOwner(userId);

        match /exercises/{exerciseId} {
          allow read, write: if isOwner(userId);
        }
      }

      match /sessions/{sessionId} {
        allow read, write: if isOwner(userId);
      }

      match /activityDays/{activityDayId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

6. Clique em `Publish`

## Publicar regras via Firebase CLI

Se preferir publicar pelo terminal:

1. Instale a CLI:

```bash
npm install -g firebase-tools
```

2. Faca login:

```bash
firebase login
```

3. Inicialize ou vincule o projeto:

```bash
firebase use --add
```

Escolha o projeto Firebase correto para o ambiente que voce estiver usando.

4. Publique as regras:

```bash
firebase deploy --only firestore:rules
```

## Estrutura de dados esperada

Colecoes usadas pelo app:

- `users/{userId}`
- `users/{userId}/workouts/{workoutId}`
- `users/{userId}/workouts/{workoutId}/exercises/{exerciseId}`
- `users/{userId}/sessions/{sessionId}`
- `users/{userId}/activityDays/{yyyy-mm-dd}`

## Problema comum: Missing or insufficient permissions

Se aparecer esse erro ao criar treino ou exercicio, normalmente significa:

- Authentication nao esta habilitado
- o usuario nao esta logado
- Firestore Rules nao foram publicadas
- o app esta usando um projeto Firebase diferente do esperado

## Status atual do projeto

Ja implementado:

- autenticacao com email e senha
- dashboard
- CRUD de treinos
- CRUD de exercicios
- historico e streak
- layout dark premium responsivo

Ainda pendente:

- execucao do treino com checklist
- conclusao de treino gerando sessoes automaticamente
