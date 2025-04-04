# Tarrot Monorepo

This repository contains the source code for the Tarrot application, managed as a monorepo using pnpm workspaces and Turborepo.

## Project Structure

The repository is organized as follows:

-   `apps/`: Contains the individual applications.
    -   `web`: The Next.js web application.
    -   `mobile`: The Expo (React Native) mobile application.
-   `packages/`: Contains shared packages used across applications.
    -   `api-schema`: Defines the shared API schema (e.g., using Zod).
    -   `constants`: Shared constants like colors, card data, etc.
    -   `eslint-config`: Shared ESLint configuration.
    -   `tarot-logic`: Core Tarot reading logic.
    -   `types`: Shared TypeScript types.
    -   `typescript-config`: Shared TypeScript configurations.
    -   `ui`: Shared React/React Native UI components.
    -   `utils`: Shared utility functions and hooks.

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
