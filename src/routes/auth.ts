import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { getUserByEmail, verifyPassword, setSessionCookie, deleteSessionCookie, getSessionUser } from '../lib/auth'

const auth = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    console.log('[Login] Request received:', { email })
    
    if (!email || !password) {
      console.log('[Login] Missing credentials')
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    const user = await getUserByEmail(c.env.DB, email)
    
    if (!user) {
      console.log('[Login] User not found:', email)
      return c.json({ error: 'Invalid email or password' }, 401)
    }
    
    console.log('[Login] User found:', { id: user.id, email: user.email, role: user.role })
    
    const isValidPassword = await verifyPassword(password, user.password_hash)
    
    if (!isValidPassword) {
      console.log('[Login] Invalid password for:', email)
      return c.json({ error: 'Invalid email or password' }, 401)
    }
    
    console.log('[Login] Password verified, setting session cookie')
    
    setSessionCookie(c, user.id)
    
    console.log('[Login] Login successful:', { id: user.id, role: user.role })
    
    return c.json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('[Login] Error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
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
