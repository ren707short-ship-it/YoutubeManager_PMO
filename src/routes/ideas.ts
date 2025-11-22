import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const ideas = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
ideas.use('*', authMiddleware)
ideas.use('*', ownerOnlyMiddleware) // Ideas are owner-only

// Get all ideas
ideas.get('/', async (c) => {
  const query = `
    SELECT i.*, v.title as linked_video_title
    FROM ideas i
    LEFT JOIN videos v ON i.linked_video_id = v.id
    ORDER BY i.priority DESC, i.created_at DESC
  `
  
  const result = await c.env.DB.prepare(query).all()
  
  return c.json({ ideas: result.results })
})

// Get idea by ID
ideas.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const query = `
    SELECT i.*, v.title as linked_video_title
    FROM ideas i
    LEFT JOIN videos v ON i.linked_video_id = v.id
    WHERE i.id = ?
  `
  
  const result = await c.env.DB.prepare(query).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'Idea not found' }, 404)
  }
  
  return c.json({ idea: result })
})

// Create new idea
ideas.post('/', async (c) => {
  const { genre, summary, reference_url, priority, status } = await c.req.json()
  
  if (!summary) {
    return c.json({ error: 'Summary is required' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO ideas (genre, summary, reference_url, priority, status)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    genre || null,
    summary,
    reference_url || null,
    priority || 0,
    status || 'unused'
  ).run()
  
  return c.json({ 
    success: true, 
    idea: { 
      id: result.meta.last_row_id,
      genre,
      summary,
      reference_url,
      priority: priority || 0,
      status: status || 'unused'
    }
  }, 201)
})

// Update idea
ideas.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { genre, summary, reference_url, priority, status, linked_video_id } = await c.req.json()
  
  if (!summary) {
    return c.json({ error: 'Summary is required' }, 400)
  }
  
  await c.env.DB.prepare(`
    UPDATE ideas SET
      genre = ?,
      summary = ?,
      reference_url = ?,
      priority = ?,
      status = ?,
      linked_video_id = ?
    WHERE id = ?
  `).bind(
    genre || null,
    summary,
    reference_url || null,
    priority || 0,
    status || 'unused',
    linked_video_id || null,
    id
  ).run()
  
  return c.json({ success: true })
})

// Delete idea
ideas.delete('/:id', async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM ideas WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

// Create video from idea
ideas.post('/:id/create-video', async (c) => {
  const id = c.req.param('id')
  const { account_id, title, assigned_creator_id } = await c.req.json()
  
  if (!account_id) {
    return c.json({ error: 'account_id is required' }, 400)
  }
  
  // Get idea
  const idea: any = await c.env.DB.prepare(
    'SELECT * FROM ideas WHERE id = ?'
  ).bind(id).first()
  
  if (!idea) {
    return c.json({ error: 'Idea not found' }, 404)
  }
  
  // Create video
  const videoResult = await c.env.DB.prepare(`
    INSERT INTO videos (
      account_id, title, template_type, status, assigned_creator_id, script_text
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    account_id,
    title || idea.summary,
    idea.genre,
    'idea',
    assigned_creator_id || null,
    idea.summary
  ).run()
  
  // Update idea status and link to video
  await c.env.DB.prepare(`
    UPDATE ideas SET status = 'used', linked_video_id = ? WHERE id = ?
  `).bind(videoResult.meta.last_row_id, id).run()
  
  return c.json({ 
    success: true, 
    video_id: videoResult.meta.last_row_id
  }, 201)
})

export default ideas
