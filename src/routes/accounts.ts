import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const accounts = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
accounts.use('*', authMiddleware)

// Get all accounts (filtered by role)
accounts.get('/', async (c) => {
  const user = c.get('user')
  
  let query = `
    SELECT a.*, 
           u1.name as owner_name,
           u2.name as creator_name
    FROM accounts a
    LEFT JOIN users u1 ON a.owner_user_id = u1.id
    LEFT JOIN users u2 ON a.assigned_creator_id = u2.id
  `
  
  if (user?.role === 'creator') {
    query += ' WHERE a.assigned_creator_id = ?'
    const result = await c.env.DB.prepare(query).bind(user.id).all()
    return c.json({ accounts: result.results })
  } else {
    query += ' ORDER BY a.id DESC'
    const result = await c.env.DB.prepare(query).all()
    return c.json({ accounts: result.results })
  }
})

// Get account by ID
accounts.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  
  const query = `
    SELECT a.*, 
           u1.name as owner_name,
           u2.name as creator_name
    FROM accounts a
    LEFT JOIN users u1 ON a.owner_user_id = u1.id
    LEFT JOIN users u2 ON a.assigned_creator_id = u2.id
    WHERE a.id = ?
  `
  
  const result = await c.env.DB.prepare(query).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'Account not found' }, 404)
  }
  
  // Check permission for creator
  if (user?.role === 'creator' && result.assigned_creator_id !== user.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  return c.json({ account: result })
})

// Create new account (owner only)
accounts.post('/', ownerOnlyMiddleware, async (c) => {
  const { name, platform, url, genre, assigned_creator_id } = await c.req.json()
  const user = c.get('user')
  
  if (!name) {
    return c.json({ error: 'Name is required' }, 400)
  }
  
  const result = await c.env.DB.prepare(
    'INSERT INTO accounts (name, platform, url, genre, owner_user_id, assigned_creator_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(
    name, 
    platform || 'youtube', 
    url || null, 
    genre || null, 
    user?.id,
    assigned_creator_id || null
  ).run()
  
  return c.json({ 
    success: true, 
    account: { 
      id: result.meta.last_row_id,
      name,
      platform: platform || 'youtube',
      url,
      genre,
      owner_user_id: user?.id,
      assigned_creator_id
    }
  }, 201)
})

// Update account (owner only)
accounts.put('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  const { name, platform, url, genre, assigned_creator_id } = await c.req.json()
  
  if (!name) {
    return c.json({ error: 'Name is required' }, 400)
  }
  
  await c.env.DB.prepare(
    'UPDATE accounts SET name = ?, platform = ?, url = ?, genre = ?, assigned_creator_id = ? WHERE id = ?'
  ).bind(name, platform || 'youtube', url || null, genre || null, assigned_creator_id || null, id).run()
  
  return c.json({ success: true })
})

// Delete account (owner only)
accounts.delete('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM accounts WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default accounts
