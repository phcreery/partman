/// <reference types="vite/client" />

type ImportMetaEnvAugmented = import("@julr/vite-plugin-validate-env").ImportMetaEnvAugmented<
  typeof import("../build/env").default
>;

interface ViteTypeOptions {
  // Avoid adding an index type to `ImportMetaDev` so
  // there's an error when accessing unknown properties.
  // ⚠️ This option requires Vite 6.3.x or higher
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv extends ImportMetaEnvAugmented {
  // Now import.meta.env is totally type-safe and based on your `env.ts` schema definition
  // You can also add custom variables that are not defined in your schema
}
