module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime", // If using React 17+ new JSX transform
    "prettier", // Add prettier last to override other formatting rules
    "turbo", // Recommended for Turborepo projects
  ],
  plugins: ["react"], // @typescript-eslint は extends でロードされるため削除
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    // Add custom rules or override defaults here
    "react/prop-types": "off", // Disable prop-types as we use TypeScript
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Add other rules as needed
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
};
