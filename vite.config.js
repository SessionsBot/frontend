import { defineConfig } from 'vite'
import pkg from './package.json'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// html minify plugin:
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  // Plugins:
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ],
      dts: './private/components.d.ts',
    }),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'], // Auto-import things like ref, onMounted, etc.
      dts: './private/auto-imports.d.ts',   // optional, good for TS/IDE help
    }),
  ],
  // Global Vars:
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // Path Resolver:
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize/Ignore Deps:
  optimizeDeps: {
    exclude: ['@sessionsbot/api-types'] // don’t pre-bundle this package
  }
})
