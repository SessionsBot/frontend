import { defineConfig } from 'vite'
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
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'], // Auto-import things like ref, onMounted, etc.
      dts: 'private/auto-imports.d.ts',   // optional, good for TS/IDE help
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
