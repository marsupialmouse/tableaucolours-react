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
    setupFiles: ['src/test-setup.ts'],
  },
})

export default mergeConfig(config, testConfig)
