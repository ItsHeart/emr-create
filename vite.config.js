import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'EmrCreate',
      fileName: 'emr-create',
    },
    rollupOptions: {
      external: ['vue', 'naive-ui', '@form-create/naive-ui'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'naive-ui': 'NaiveUI',
          '@form-create/naive-ui': 'FormCreate',
        },
      },
    },
  },
})
