import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest", // Latest ECMAScript syntax
        sourceType: "module", // Enables ESM (import/export)
      },
    },
    env: {
      jest: true,
    },
    rules: {
      "no-unused-vars": "warn", // Warn about declared but unused variables
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      eqeqeq: "error", // Enforce strict equality checks (===)
      "prefer-const": "error", // Encourage `const` over `let` for variables
      "no-var": "error", // Disallow `var` in favor of `let` and `const`
    },
  },
  pluginJs.configs.recommended,
  prettier,
];
