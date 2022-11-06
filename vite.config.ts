import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { wrapperEnv } from "./src/utils/getEnv";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import eslintPlugin from "vite-plugin-eslint";
import vueJsx from "@vitejs/plugin-vue-jsx";
import importToCDN from "vite-plugin-cdn-import";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    // base: "/",
    // alias config
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        json2csv: "json2csv/dist/json2csv.umd.js"
      }
    },
    // global css
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/var.scss";`
        }
      }
    },
    // server config
    server: {
      host: "0.0.0.0", // Server host name, if external access is allowed, it can be set to "0.0.0.0"
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // https: false,
      // Agent cross -domain (Mock does not need to be configured, here is just a matter)
      proxy: {
        "/api": {
          // target: "https://www.fastmock.site/mock/f81e8333c1a9276214bcdbc170d9e0a0", // fastmock
          target: "https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e", // easymock
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      }
    },
    // plugins
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnv.VITE_GLOB_APP_TITLE
          }
        }
      }),
      // * EsLint: The error information is displayed on the browser interface
      // eslintPlugin(),
      // * VITE can use JSX/TSX syntax
      vueJsx(),
      // * name can be written on the script tag
      VueSetupExtend(),
      // * Demand Import Element
      // AutoImport({
      // 	resolvers: [ElementPlusResolver()]
      // }),
      // Components({
      // 	resolvers: [ElementPlusResolver()]
      // }),
      // * cdn 引入（vue、element-plus）
      importToCDN({
        modules: [
          // The introduction of Vue on demand will lead to a problem with Vue plug -in (column: PINIA/Vuex)
          // {
          // 	name: "vue",
          // 	var: "Vue",
          // 	path: "https://unpkg.com/vue@next"
          // },
          // When using CDN to introduce Element-Plus, the development environment still needs to introduce Element-Plus in main.js.
          // {
          // 	name: "element-plus",
          // 	var: "ElementPlus",
          // 	path: "https://unpkg.com/element-plus",
          // 	css: "https://unpkg.com/element-plus/dist/index.css"
          // }
        ]
      }),
      // * Whether to generate a preview
      // viteEnv.VITE_REPORT && visualizer(),
      // * gzip compress
      viteEnv.VITE_BUILD_GZIP &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: "gzip",
          ext: ".gz"
        })
    ],
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    // build configure
    build: {
      outDir: "dist",
      // ESBUILD package is faster, but it cannot be removed
      minify: "esbuild",
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
