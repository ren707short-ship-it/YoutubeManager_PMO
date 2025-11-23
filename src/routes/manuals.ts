import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Apply auth middleware
app.use('/*', authMiddleware)

// Get all manuals
app.get('/', async (c) => {
  const category = c.req.query('category')
  let query = 'SELECT * FROM manuals'
  let params: string[] = []
  
  if (category) {
    query += ' WHERE category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY updated_at DESC'
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json({ manuals: results })
})

// Get manual by ID
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const manual = await c.env.DB.prepare('SELECT * FROM manuals WHERE id = ?').bind(id).first()
  
  if (!manual) {
    return c.json({ error: 'Manual not found' }, 404)
  }
  
  return c.json({ manual })
})

// Create manual (owner only)
app.post('/', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const data = await c.req.json()
  const result = await c.env.DB.prepare(`
    INSERT INTO manuals (title, category, content)
    VALUES (?, ?, ?)
  `).bind(data.title, data.category, data.content).run()
  
  return c.json({ id: result.meta.last_row_id }, 201)
})

// Update manual (owner only)
app.put('/:id', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const id = c.req.param('id')
  const data = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE manuals
    SET title = ?, category = ?, content = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(data.title, data.category, data.content, id).run()
  
  return c.json({ success: true })
})

// Delete manual (owner only)
app.delete('/:id', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM manuals WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// Get categories
app.get('/meta/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT DISTINCT category FROM manuals ORDER BY category').all()
  return c.json({ categories: results })
})

export default app
