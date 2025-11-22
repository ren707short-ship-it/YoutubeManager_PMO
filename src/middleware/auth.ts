import { createMiddleware } from 'hono/factory'
import type { Bindings, Variables } from '../types'
import { getSessionUser } from '../lib/auth'

export const authMiddleware = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
  const user = await getSessionUser(c)
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  c.set('user', user)
  await next()
})

export const ownerOnlyMiddleware = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
  const user = c.get('user')
  
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Forbidden: Owner only' }, 403)
  }
  
  await next()
})
