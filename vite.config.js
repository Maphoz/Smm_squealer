import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
     "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ['vue'],
   },
   optimizeDeps: {
    include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
   },
   build: {
    rollupOptions: {
      resolve: {
        dedupe: ['vue']
      },
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
   }
})
