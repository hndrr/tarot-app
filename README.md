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
        B["apps/web (Next.js)"];
        C["apps/mobile (React Native/Expo)"];
    end

    subgraph "Shared Packages"
        UI[packages/ui];
        Logic["packages/tarot-logic (unused)"];
        Const[packages/constants];
        Types[packages/types];
        Utils[packages/utils];
        Schema["packages/api-schema (unused)"];
        Lint[packages/eslint-config];
        TSConfig[packages/typescript-config];
    end

    subgraph "External Services"
        AI["External AI (Gemini/Cloudflare?)"];
    end

    subgraph "Development Tools"
        PNPM["pnpm workspaces"];
        Turbo["Turbo Repo"];
    end

    User --> B;
    User --> C;

    B --> UI;
    B --> Const;
    B --> Types;
    B --> Utils;
    B --> AI;

    C --> UI;
    C --> Const;
    C --> Types;
    C --> Utils;
    C --> AI;

    B -.-> Lint & TSConfig;
    C -.-> Lint & TSConfig;
    UI -.-> Lint & TSConfig;
    Logic -.-> Lint & TSConfig;
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

### Data Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant WebApp as "apps/web"
    participant WebLib as "generateTarotMessageGemini.ts (in web)"
    participant GeminiAI as "Gemini AI"
    participant MobileApp as "apps/mobile"
    participant MobileLib as "generateTarotMessage...ts (in mobile)"
    participant AIService as "AI Service (Gemini/Cloudflare)"
    participant UI as "packages/ui"

    Note over User, WebApp: Tarot Reading (Web)
    User->>WebApp: Interact (Request Reading)
    WebApp->>WebLib: Call generateTarotMessageGemini()
    WebLib->>GeminiAI: Send request (card info, etc.)
    GeminiAI-->>WebLib: Return interpretation
    WebLib-->>WebApp: Return formatted result
    WebApp->>UI: Use UI components
    UI-->>WebApp: Rendered components
    WebApp-->>User: Display reading result

    Note over User, MobileApp: Tarot Reading (Mobile)
    User->>MobileApp: Interact (Request Reading)
    MobileApp->>MobileLib: Call generateTarotMessage...()
    MobileLib->>AIService: Send request (card info, etc.)
    AIService-->>MobileLib: Return interpretation
    MobileLib-->>MobileApp: Return formatted result
    MobileApp->>UI: Use UI components
    UI-->>MobileApp: Rendered components
    MobileApp-->>User: Display reading result
```

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

## Troubleshooting

### Build Error: Module not found: Can't resolve './elevenlabs'

**Symptoms:**

When running `pnpm build`, the build process for the `apps/web` package fails with an error similar to:

```
@tarrot/web:build: ../../packages/constants/dist/index.js
@tarrot/web:build: Module not found: Can't resolve './elevenlabs'
```

**Cause:**

This error typically occurs when the build output (`dist` directory) of the `@repo/constants` package does not contain the expected `elevenlabs.js` file. This might happen due to stale Turborepo cache or issues with TypeScript's incremental build information (`tsconfig.tsbuildinfo`).

**Solution:**

1.  **Clean the specific package's build artifacts:** Manually remove the `dist` directory and `tsconfig.tsbuildinfo` file from the affected package (`@repo/constants` in this case).

    ```bash
    rm -rf packages/constants/dist packages/constants/tsconfig.tsbuildinfo
    ```

2.  **Rebuild the project:** Run the build command again.

    ```bash
    pnpm build
    ```

This ensures that the package is rebuilt from a clean state, resolving potential caching issues.
