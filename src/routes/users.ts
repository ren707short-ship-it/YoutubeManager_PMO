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
    'SELECT id, name, email, role, created_at FROM users ORDER BY id'
  ).all()
  
  return c.json({ users: result.results })
})

// Get user by ID
users.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const result = await c.env.DB.prepare(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?'
  ).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json({ user: result })
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
  const { name, email, password, role } = await c.req.json()
  
  if (!name || !email || !role) {
    return c.json({ error: 'Name, email, and role are required' }, 400)
  }
  
  if (role !== 'owner' && role !== 'creator') {
    return c.json({ error: 'Invalid role' }, 400)
  }
  
  try {
    if (password) {
      const passwordHash = await hashPassword(password)
      await c.env.DB.prepare(
        'UPDATE users SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?'
      ).bind(name, email, passwordHash, role, id).run()
    } else {
      await c.env.DB.prepare(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?'
      ).bind(name, email, role, id).run()
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
