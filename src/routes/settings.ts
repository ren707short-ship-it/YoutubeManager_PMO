import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Apply auth middleware
app.use('/*', authMiddleware)

// Get settings (owner only)
app.get('/', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const { results } = await c.env.DB.prepare('SELECT key, value FROM settings').all()
  const settings: Record<string, string> = {}
  results.forEach((row: any) => {
    settings[row.key] = row.value
  })
  
  return c.json({ settings })
})

// Update setting (owner only)
app.put('/:key', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const key = c.req.param('key')
  const { value } = await c.req.json()
  
  await c.env.DB.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
  `).bind(key, value, value).run()
  
  return c.json({ success: true })
})

export default app
