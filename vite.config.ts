import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import defineOptions from 'unplugin-vue-define-options/dist/vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      // 自动导入组件
      resolvers: [AntDesignVueResolver()],
      dts: 'src/type/components.d.ts',
    }),
    AutoImport({
      // 自动导入
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      // auto-import.d.ts生成的位置(默认是在根目录) 会在
      dts: 'src/type/auto-import.d.ts',
    }),
    defineOptions(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    https: false,
    proxy: {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    terserOptions: {
      // 去除console.log
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/main.scss";',
      },
    },
  },
})
