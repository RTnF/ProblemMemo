import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

// 環境変数に応じてオリジンを決定する
const getAllowOrigin = () => {
  // AWS Lambda環境ではデフォルトで NODE_ENV が設定される
  // またはCDKから注入した特定の環境変数を参照する
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5173' // Viteのデフォルトポート
  }
  return 'https://rtnfcp.net'
}

app.use(
  '/api/*',
  cors({
    origin: getAllowOrigin(),
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600, // プリフライトリクエストの結果をキャッシュする時間（秒）
  })
)

app.get('/api/hello', (c) => {
  return c.text('Hello Hono!')
})

// AWS Lambda用のエクスポート
export const handler = handle(app)

// Vite Dev Server用のエクスポート
export default app