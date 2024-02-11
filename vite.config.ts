/// <reference types="vitest" />
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,jsx,ts,tsx}'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  esbuild: {
    jsx: 'automatic',
    target: 'es2022',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: []
  },
  build: {
    rollupOptions: {
      treeshake: { propertyReadSideEffects: 'always' },
    }
  },
  plugins: [],
})
