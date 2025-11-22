import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { getUserByEmail, verifyPassword, setSessionCookie, deleteSessionCookie, getSessionUser } from '../lib/auth'

const auth = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Login
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  
  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }
  
  const user = await getUserByEmail(c.env.DB, email)
  
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }
  
  const isValidPassword = await verifyPassword(password, user.password_hash)
  
  if (!isValidPassword) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }
  
  setSessionCookie(c, user.id)
  
  return c.json({ 
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

// Logout
auth.post('/logout', (c) => {
  deleteSessionCookie(c)
  return c.json({ success: true })
})

// Get current user
auth.get('/me', async (c) => {
  const user = await getSessionUser(c)
  
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  return c.json({ user })
})

export default auth
