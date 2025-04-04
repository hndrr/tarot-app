import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

// Note: The 'content' field is configured in the root tailwind.config.js
// or in the app-specific tailwind configs that consume this package.
// This package itself doesn't need to scan files for classes.
