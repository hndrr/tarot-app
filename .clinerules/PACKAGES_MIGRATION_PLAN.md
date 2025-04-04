# Monorepo Packages Migration Plan

This document outlines the plan for refactoring the codebase by moving shared types, utilities, UI components, etc., into dedicated packages under the `packages/*` directory and updating import paths within the applications.

## 1. Create New Packages

The following packages will be created in the `packages/` directory:

*   **`ui`**: Contains shared React components (e.g., `Button`, `Card`, `Spinner`).
*   **`types`**: Contains shared TypeScript type definitions (e.g., `TarotCard` type).
*   **`constants`**: Contains shared constants (e.g., `Colors`, `tarotCards` data).
*   **`utils`**: Contains shared utility functions and custom hooks (e.g., `delay`, `useColorScheme`).
*   **`tarot-logic`**: Contains core logic related to tarot readings (e.g., `generateTarotMessage*`).

## 2. Move Files

*   Move common components from `apps/mobile/src/components/*` and `apps/web/src/components/*` to `packages/ui/src/`. Platform-specific components might remain in their respective apps or be separated within `packages/ui` (e.g., `Button.native.tsx`, `Button.tsx`).
*   Move `apps/mobile/src/constants/Colors.ts` to `packages/constants/src/`.
*   Consolidate `apps/mobile/src/data/tarotCards.ts` and `apps/web/src/data/tarotCards.ts`. Move the data itself to `packages/constants/src/` and the type definitions to `packages/types/src/`.
*   Move shareable hooks from `apps/mobile/src/hooks/*` to `packages/utils/src/hooks/`.
*   Move common logic from `apps/mobile/src/lib/*` and `apps/web/src/lib/*` to `packages/utils/src/` or `packages/tarot-logic/src/`.

## 3. Configure Dependencies

*   Add dependencies (`workspace:*`) to the newly created `packages/*` in `apps/mobile/package.json` and `apps/web/package.json`.
*   Create/update `package.json` for each new package (`packages/*/package.json`) specifying necessary dependencies (React, TypeScript, etc.).
*   Configure `paths` in the root `tsconfig.base.json` to enable package references like `@repo/ui`, `@repo/types`, etc.

## 4. Update Import Paths

*   Update all `import` paths in `apps/mobile` and `apps/web` to reference the new package paths (e.g., `import { Button } from '@repo/ui';`).

## 5. Verify Build Configuration

*   Verify and, if necessary, adjust the monorepo's build configurations (`turbo.json`, `tsconfig.json` files, `next.config.ts`, `metro.config.js`, etc.) to ensure they work correctly with the new structure.

## Change Visualization (Mermaid)

```mermaid
graph TD
    subgraph Before
        A[apps/mobile] --> A_comp[components]
        A --> A_lib[lib]
        A --> A_data[data]
        A --> A_const[constants]
        A --> A_hooks[hooks]
        B[apps/web] --> B_comp[components]
        B --> B_lib[lib]
        B --> B_data[data]
    end

    subgraph After
        P_ui[packages/ui]
        P_types[packages/types]
        P_utils[packages/utils]
        P_const[packages/constants]
        P_logic[packages/tarot-logic]

        C[apps/mobile] --> P_ui
        C --> P_types
        C --> P_utils
        C --> P_const
        C --> P_logic

        D[apps/web] --> P_ui
        D --> P_types
        D --> P_utils
        D --> P_const
        D --> P_logic
    end