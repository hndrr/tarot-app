# Tarrot Monorepo

This repository contains the source code for the Tarrot application, managed as a monorepo using pnpm workspaces and Turborepo.

## Project Structure

The repository is organized as follows:

-   `apps/`: Contains the individual applications.
    -   `web`: The Next.js web application.
    -   `mobile`: The Expo (React Native) mobile application.
-   `packages/`: Contains shared packages used across applications.
    -   `api-schema`: (Currently unused) Defines the shared API schema.
    -   `constants`: Shared constants like colors, card data, etc.
    -   `eslint-config`: Shared ESLint configuration.
    -   `tarot-logic`: (Currently unused) Core Tarot reading logic. Intended for future use.
    -   `types`: Shared TypeScript types.
    -   `typescript-config`: Shared TypeScript configurations.
    -   `ui`: Shared React/React Native UI components.
    -   `utils`: Shared utility functions and hooks.

## Architecture Overview

### Diagram

```mermaid
graph TD
    subgraph "User Facing Apps"
        B[apps/web (Next.js)];
        C[apps/mobile (React Native/Expo)];
    end

    subgraph "Shared Packages"
        UI[packages/ui];
        Logic[packages/tarot-logic (unused)];
        Const[packages/constants];
        Types[packages/types];
        Utils[packages/utils];
        Schema[packages/api-schema (unused)];
        Lint[packages/eslint-config];
        TSConfig[packages/typescript-config];
    end

    subgraph "External Services"
        AI[External AI (Gemini/Cloudflare?)];
    end

    subgraph "Development Tools"
        PNPM[pnpm workspaces];
        Turbo[Turbo Repo];
    end

    User --> B;
    User --> C;

    B --> UI;
    B --> Const;
    B --> Types;
    B --> Utils;
    B --> AI; # Webアプリから直接AIへ

    C --> UI;
    C --> Const;
    C --> Types;
    C --> Utils;
    C --> AI; # Mobileアプリから直接AIへ

    B -.-> Lint & TSConfig;
    C -.-> Lint & TSConfig;
    UI -.-> Lint & TSConfig;
    Logic -.-> Lint & TSConfig; # Logic自体は残すが依存はされない
    Const -.-> Lint & TSConfig;
    Types -.-> Lint & TSConfig;
    Utils -.-> Lint & TSConfig;
    Schema -.-> Lint & TSConfig;

    PNPM & Turbo -- Manages --> B & C & UI & Logic & Const & Types & Utils & Schema & Lint & TSConfig;

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style AI fill:#ccf,stroke:#333,stroke-width:2px
    style PNPM fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
    style Turbo fill:#eee,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
```

### Data Flow

- **Tarot Reading (Web):**
  1. User interacts with the Web App (`apps/web`).
  2. `apps/web` calls `apps/web/src/lib/generateTarotMessageGemini.ts`.
  3. `generateTarotMessageGemini.ts` sends a request to the Gemini AI service.
  4. Gemini AI returns the interpretation.
  5. `generateTarotMessageGemini.ts` formats the result.
  6. `apps/web` displays the result using components from `packages/ui`.

- **Tarot Reading (Mobile):**
  1. User interacts with the Mobile App (`apps/mobile`).
  2. `apps/mobile` calls `apps/mobile/src/lib/generateTarotMessageGemini.ts` (or Cloudflare version).
  3. `generateTarotMessage...ts` sends a request to the corresponding AI service.
  4. The AI service returns the interpretation.
  5. `generateTarotMessage...ts` formats the result.
  6. `apps/mobile` displays the result using components from `packages/ui`.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Version specified in `.volta` or `package.json`)
-   [pnpm](https://pnpm.io/)

### Installation

Install dependencies for all packages and applications:

```bash
pnpm install
```

### Development

Run all applications in development mode:

```bash
pnpm dev
```

This command uses Turborepo to efficiently run the development servers for both the web and mobile apps concurrently.

-   **Web App:** Typically available at [http://localhost:3000](http://localhost:3000).
-   **Mobile App:** Follow the Expo CLI instructions to open the app on a simulator or physical device.

To run a specific application or package script, use Turborepo's filtering capabilities or run the script directly within the respective directory. For example, to run only the web app:

```bash
pnpm dev --filter=@tarrot/web
```

## Building

Build all applications and packages:

```bash
pnpm build
```

## Linting and Type Checking

Lint all code:

```bash
pnpm lint
```

Check TypeScript types:

```bash
pnpm type-check
```

## Learn More

-   [pnpm Workspaces](https://pnpm.io/workspaces)
-   [Turborepo Documentation](https://turbo.build/repo/docs)
-   [Next.js Documentation](https://nextjs.org/docs) (for the `apps/web` application)
-   [Expo Documentation](https://docs.expo.dev/) (for the `apps/mobile` application)
