export const setupChecklist = [
  "Next.js App Router com TypeScript",
  "Tailwind CSS v4 e shadcn/ui inicializados",
  "Tema dark premium como padrão global",
  "Estrutura de pastas por domínio e responsabilidade",
  "Configuração inicial do Firebase centralizada",
  "Layout base mobile-first com shell reutilizável",
];

export const appFeatures = [
  {
    title: "src/lib/firebase",
    description: "Inicialização única do app, Auth, Firestore e Analytics opcional.",
  },
  {
    title: "src/components/layout",
    description: "Shell principal, sidebar, topbar e superfícies reutilizáveis.",
  },
  {
    title: "src/config",
    description: "Constantes globais e metadados do app.",
  },
  {
    title: "src/hooks, services, types",
    description: "Diretórios preparados para a próxima camada de domínio.",
  },
];
