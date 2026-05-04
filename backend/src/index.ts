import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const app = new Hono()
const isLocal = process.env.NODE_ENV === 'development'

// 環境変数に応じてオリジンを決定する
const getAllowOrigin = () => {
  // AWS Lambda環境ではデフォルトで NODE_ENV が設定される
  // またはCDKから注入した特定の環境変数を参照する
  if (isLocal) {
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

// --- DynamoDB設定 ---
const clientConfig = isLocal
  ? {
    endpoint: 'http://localhost:5175',
    region: 'local',
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local',
    },
  }
  : {
    region: process.env.REGION,
  }

const client = new DynamoDBClient(clientConfig)
const docClient = DynamoDBDocumentClient.from(client)
const TABLE_NAME = process.env.TABLE_NAME

app.get('/api/problems/:problem_id', async (c) => {
  try {
    const problem_id = c.req.param('problem_id')
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { problem_id }
    }))

    if (!result.Item) {
      return c.json({ message: 'Not Found' }, 404)
    }
    console.log(result.Item)
    const tagsArray = [...(result.Item?.tags ?? [])];
    tagsArray.sort();
    result.Item.tags = tagsArray;
    return c.json(result.Item)
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Internal Server Error' }, 500)
  }
})

// AWS Lambda用のエクスポート
export const handler = handle(app)

// Vite Dev Server用のエクスポート
export default app