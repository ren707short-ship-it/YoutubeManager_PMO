import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const affiliates = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
affiliates.use('*', authMiddleware)

// Get all affiliate links
affiliates.get('/', async (c) => {
  const user = c.get('user')
  
  let query = 'SELECT '
  
  if (user?.role === 'creator') {
    // Hide URL from creators
    query += 'id, service_name, internal_name, created_at'
  } else {
    query += '*'
  }
  
  query += ' FROM affiliate_links ORDER BY id DESC'
  
  const result = await c.env.DB.prepare(query).all()
  
  return c.json({ affiliates: result.results })
})

// Get affiliate link by ID
affiliates.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  
  let query = 'SELECT '
  
  if (user?.role === 'creator') {
    // Hide URL and templates from creators
    query += 'id, service_name, internal_name, created_at'
  } else {
    query += '*'
  }
  
  query += ' FROM affiliate_links WHERE id = ?'
  
  const result = await c.env.DB.prepare(query).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'Affiliate link not found' }, 404)
  }
  
  return c.json({ affiliate: result })
})

// Create new affiliate link (owner only)
affiliates.post('/', ownerOnlyMiddleware, async (c) => {
  const { service_name, internal_name, url, description_template, community_template } = await c.req.json()
  
  if (!service_name || !internal_name || !url) {
    return c.json({ error: 'service_name, internal_name, and url are required' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO affiliate_links (
      service_name, internal_name, url, description_template, community_template
    ) VALUES (?, ?, ?, ?, ?)
  `).bind(
    service_name,
    internal_name,
    url,
    description_template || null,
    community_template || null
  ).run()
  
  return c.json({ 
    success: true, 
    affiliate: { 
      id: result.meta.last_row_id,
      service_name,
      internal_name,
      url
    }
  }, 201)
})

// Update affiliate link (owner only)
affiliates.put('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  const { service_name, internal_name, url, description_template, community_template } = await c.req.json()
  
  if (!service_name || !internal_name || !url) {
    return c.json({ error: 'service_name, internal_name, and url are required' }, 400)
  }
  
  await c.env.DB.prepare(`
    UPDATE affiliate_links SET
      service_name = ?,
      internal_name = ?,
      url = ?,
      description_template = ?,
      community_template = ?
    WHERE id = ?
  `).bind(
    service_name,
    internal_name,
    url,
    description_template || null,
    community_template || null,
    id
  ).run()
  
  return c.json({ success: true })
})

// Delete affiliate link (owner only)
affiliates.delete('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM affiliate_links WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default affiliates
