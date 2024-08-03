import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
    optimizeDeps: {
      include: ['jwt-decode'],
    },
  },
})
