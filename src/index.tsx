import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, Variables } from './types'

// Import routes
import auth from './routes/auth'
import users from './routes/users'
import accounts from './routes/accounts'
import videos from './routes/videos'
import comments from './routes/comments'
import ideas from './routes/ideas'
import affiliates from './routes/affiliates'
import dashboard from './routes/dashboard'
import creatorAssets from './routes/creator-assets'
import references from './routes/references'
import accountAssets from './routes/account-assets'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Enable CORS
app.use('/api/*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Set-Cookie']
}))

// API routes
app.route('/api/auth', auth)
app.route('/api/users', users)
app.route('/api/accounts', accounts)
app.route('/api/videos', videos)
app.route('/api/comments', comments)
app.route('/api/ideas', ideas)
app.route('/api/affiliates', affiliates)
app.route('/api/dashboard', dashboard)
app.route('/api/creator-assets', creatorAssets)
app.route('/api/references', references)
app.route('/api/account-assets', accountAssets)

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Root route - serve main HTML
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Shorts 管理システム</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
    }
  </style>
</head>
<body class="bg-gray-100">
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

// Catch-all route for SPA routing
app.get('*', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube Shorts 管理システム</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
    }
  </style>
</head>
<body class="bg-gray-100">
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
