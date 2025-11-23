import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Apply auth middleware
app.use('/*', authMiddleware)

// Get all templates
app.get('/', async (c) => {
  const category = c.req.query('category')
  let query = 'SELECT * FROM video_templates'
  let params: string[] = []
  
  if (category) {
    query += ' WHERE category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY created_at DESC'
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json({ templates: results })
})

// Get template by ID
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const template = await c.env.DB.prepare('SELECT * FROM video_templates WHERE id = ?').bind(id).first()
  
  if (!template) {
    return c.json({ error: 'Template not found' }, 404)
  }
  
  return c.json({ template })
})

// Create template (owner only)
app.post('/', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const data = await c.req.json()
  const result = await c.env.DB.prepare(`
    INSERT INTO video_templates (name, category, description, capcut_project_url, script_jp_template, script_en_template, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.category,
    data.description || null,
    data.capcut_project_url || null,
    data.script_jp_template || null,
    data.script_en_template || null,
    data.notes || null
  ).run()
  
  return c.json({ id: result.meta.last_row_id }, 201)
})

// Update template (owner only)
app.put('/:id', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const id = c.req.param('id')
  const data = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE video_templates
    SET name = ?, category = ?, description = ?, capcut_project_url = ?, 
        script_jp_template = ?, script_en_template = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    data.name,
    data.category,
    data.description || null,
    data.capcut_project_url || null,
    data.script_jp_template || null,
    data.script_en_template || null,
    data.notes || null,
    id
  ).run()
  
  return c.json({ success: true })
})

// Delete template (owner only)
app.delete('/:id', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM video_templates WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// Get categories
app.get('/meta/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT DISTINCT category FROM video_templates ORDER BY category').all()
  return c.json({ categories: results })
})

export default app
