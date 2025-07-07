import { defineConfig, Schema } from "@julr/vite-plugin-validate-env";

export default defineConfig({
  validator: "builtin",
  schema: {
    VITE_GLOB_APP_TITLE: Schema.string(),
    VITE_PORT: Schema.number(),
    VITE_OPEN: Schema.boolean(),
    VITE_DEVTOOLS: Schema.boolean(),
    VITE_REPORT: Schema.boolean(),
    VITE_DROP_CONSOLE: Schema.boolean(),
    VITE_PWA: Schema.boolean.optional(),
    VITE_API_URL: Schema.string(),
    VITE_PUBLIC_PATH: Schema.string.optional(),
    VITE_ROUTER_MODE: Schema.enum(["hash", "history"] as const),
    VITE_USER_NODE_ENV: Schema.enum.optional(["development", "production"] as const),
    VITE_BUILD_COMPRESS: Schema.enum.optional(["none", "gzip", "brotli"] as const),
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: Schema.boolean.optional()
  }
});

export type ImportMetaEnvAugmented = import("@julr/vite-plugin-validate-env").ImportMetaEnvAugmented<
  typeof import("../build/env").default
>;

export interface ViteTypeOptions {
  // Avoid adding an index type to `ImportMetaDev` so
  // there's an error when accessing unknown properties.
  // ⚠️ This option requires Vite 6.3.x or higher
  strictImportMetaEnv: unknown;
}

export interface ViteEnv extends ImportMetaEnvAugmented {
  // Now import.meta.env is totally type-safe and based on your `env.ts` schema definition
  // You can also add custom variables that are not defined in your schema
}
