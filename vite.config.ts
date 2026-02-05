import {defineConfig, mergeConfig} from 'vite'
import {defineConfig as defineTestConfig} from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
    },
  },
})

const testConfig = defineTestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/testing/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    alias: {
      '@uiw/react-color': '@uiw/react-color/esm/index.js',
      '@uiw/react-color-name': '@uiw/react-color-name/esm/index.js',
    },
    deps: {
      optimizer: {
        web: {
          include: ['vitest-canvas-mock'],
        },
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})

export default mergeConfig(config, testConfig)
