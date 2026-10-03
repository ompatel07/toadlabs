import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // The Netlify Functions are plain .mjs, parsed here by the TypeScript
    // parser, which tolerates a duplicate const that Node refuses to load at
    // all. One such redeclaration shipped a webhook that could not even be
    // imported, and lint reported nothing, so the rule is turned on explicitly
    // for the payment code where a module that fails to load is a lost sale.
    files: ["netlify/**/*.mjs", "scripts/**/*.mjs"],
    rules: {
      "no-redeclare": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "error",
    },
  },
]);

export default eslintConfig;
