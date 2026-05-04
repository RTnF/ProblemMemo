import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  server: {
    port: 5174, // APIサーバー用のポート
  },
  plugins: [
    devServer({
      entry: 'src/index.ts', // Honoのエントリポイント
    }),
  ],
})