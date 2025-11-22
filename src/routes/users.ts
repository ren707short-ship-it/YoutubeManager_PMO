import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'
import { hashPassword } from '../lib/auth'

const users = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
users.use('*', authMiddleware)
users.use('*', ownerOnlyMiddleware)

// Get all users
users.get('/', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT id, name, email, role, contract_platform, contract_date, contract_document_url, status, notes, created_at FROM users ORDER BY id'
  ).all()
  
  return c.json({ users: result.results })
})

// Get user by ID (with full profile)
users.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await c.env.DB.prepare(
    'SELECT id, name, email, role, contract_platform, contract_date, contract_document_url, status, notes, created_at FROM users WHERE id = ?'
  ).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  // Get statistics for this user
  const stats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total_videos,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_videos,
      SUM(CASE WHEN feedback_required = 1 AND feedback_completed_at IS NULL THEN 1 ELSE 0 END) as pending_feedback
    FROM videos
    WHERE assigned_creator_id = ?
  `).bind(id).first()
  
  return c.json({ user: result, stats })
})

// Create new user
users.post('/', async (c) => {
  const { name, email, password, role } = await c.req.json()
  
  if (!name || !email || !password || !role) {
    return c.json({ error: 'All fields are required' }, 400)
  }
  
  if (role !== 'owner' && role !== 'creator') {
    return c.json({ error: 'Invalid role' }, 400)
  }
  
  const passwordHash = await hashPassword(password)
  
  try {
    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).bind(name, email, passwordHash, role).run()
    
    return c.json({ 
      success: true, 
      user: { 
        id: result.meta.last_row_id,
        name,
        email,
        role
      }
    }, 201)
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email already exists' }, 409)
    }
    throw error
  }
})

// Update user
users.put('/:id', async (c) => {
  const id = c.req.param('id')
  const { name, email, password, role, contract_platform, contract_date, contract_document_url, status, notes } = await c.req.json()
  
  if (!name || !email || !role) {
    return c.json({ error: 'Name, email, and role are required' }, 400)
  }
  
  if (role !== 'owner' && role !== 'creator') {
    return c.json({ error: 'Invalid role' }, 400)
  }
  
  try {
    if (password) {
      const passwordHash = await hashPassword(password)
      await c.env.DB.prepare(`
        UPDATE users SET 
          name = ?, email = ?, password_hash = ?, role = ?,
          contract_platform = ?, contract_date = ?, contract_document_url = ?,
          status = ?, notes = ?
        WHERE id = ?
      `).bind(name, email, passwordHash, role, contract_platform || null, contract_date || null, contract_document_url || null, status || 'active', notes || null, id).run()
    } else {
      await c.env.DB.prepare(`
        UPDATE users SET 
          name = ?, email = ?, role = ?,
          contract_platform = ?, contract_date = ?, contract_document_url = ?,
          status = ?, notes = ?
        WHERE id = ?
      `).bind(name, email, role, contract_platform || null, contract_date || null, contract_document_url || null, status || 'active', notes || null, id).run()
    }
    
    return c.json({ success: true })
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email already exists' }, 409)
    }
    throw error
  }
})

// Delete user
users.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const currentUser = c.get('user')
  
  // Prevent deleting yourself
  if (currentUser && currentUser.id === parseInt(id)) {
    return c.json({ error: 'Cannot delete yourself' }, 400)
  }
  
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default users
