import { resolve } from "path";
import type { PluginOption } from "vite";
// import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons-ng";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import eslintPlugin from "vite-plugin-eslint";
import viteCompression from "vite-plugin-compression";
// import NextDevTools from "vite-plugin-vue-devtools";
// import { codeInspectorPlugin } from "code-inspector-plugin";
// import devtoolsJson from "vite-plugin-devtools-json";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";

/**
 * Create vite plugins
 * @param viteEnv
 */
export const createVitePlugins = (viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] => {
  const { VITE_GLOB_APP_TITLE, VITE_REPORT, VITE_DEVTOOLS, VITE_PWA } = viteEnv;
  return [
    vue(),
    // Vue can use jsx/tsx syntax
    vueJsx(),

    // Validate environment variables
    ValidateEnv({
      configFile: "build/env"
    }),

    // chrome dev tools
    // devtoolsJson(),

    // devTools
    // VITE_DEVTOOLS && NextDevTools({ launchEditor: "code" }),

    // Show esLint error messages in the browser interface
    // eslintPlugin({
    //   failOnError: false
    // }),

    // Create build compression config
    createCompression(viteEnv),

    // Inject variables into html files
    createHtmlPlugin({
      minify: true,
      inject: {
        data: { title: VITE_GLOB_APP_TITLE }
      }
    }),

    // Use svg icons
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),

    // vitePWA
    // VITE_PWA && createVitePwa(viteEnv),

    // Whether to generate a bundle preview, analyze dependency package size for optimization
    VITE_REPORT && (visualizer({ filename: "stats.html", gzipSize: true, brotliSize: true }) as PluginOption)

    // Automatically open IDE and locate cursor to the source code position corresponding to the DOM. see: https://inspector.fe-dev.cn/guide/start.html
    // VITE_CODE_INSPECTOR &&
    //   codeInspectorPlugin({
    //     bundler: "vite"
    //   })

    // mock
    // mockDevServerPlugin(),
  ];
};

/**
 * @description Generate different compression rules according to the compress config
 * @param viteEnv
 */
const createCompression = (viteEnv: ImportMetaEnv): PluginOption | PluginOption[] => {
  const { VITE_BUILD_COMPRESS = "none", VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(",");
  const plugins: PluginOption[] = [];
  if (compressList.includes("gzip")) {
    plugins.push(
      viteCompression({
        ext: ".gz",
        algorithm: "gzip",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      viteCompression({
        ext: ".br",
        algorithm: "brotliCompress",
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      })
    );
  }
  return plugins;
};

/**
 * @description VitePwa
 * @param viteEnv
 */
// const createVitePwa = (viteEnv: ViteEnv): PluginOption | PluginOption[] => {
//   const { VITE_GLOB_APP_TITLE } = viteEnv;
//   return VitePWA({
//     registerType: "autoUpdate",
//     manifest: {
//       name: VITE_GLOB_APP_TITLE,
//       short_name: VITE_GLOB_APP_TITLE,
//       theme_color: "#ffffff",
//       icons: [
//         {
//           src: "/logo.png",
//           sizes: "192x192",
//           type: "image/png"
//         },
//         {
//           src: "/logo.png",
//           sizes: "512x512",
//           type: "image/png"
//         },
//         {
//           src: "/logo.png",
//           sizes: "512x512",
//           type: "image/png",
//           purpose: "any maskable"
//         }
//       ]
//     }
//   });
// };
