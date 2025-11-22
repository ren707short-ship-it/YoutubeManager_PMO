import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const creatorAssets = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware
creatorAssets.use('*', authMiddleware)

// Get assets for a creator
creatorAssets.get('/user/:userId', async (c) => {
  const userId = c.req.param('userId')
  const user = c.get('user')
  
  // Creators can only see their own assets
  if (user?.role === 'creator' && user.id !== parseInt(userId)) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM creator_assets 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).bind(userId).all()
  
  return c.json({ assets: result.results })
})

// Create asset (owner only)
creatorAssets.post('/', ownerOnlyMiddleware, async (c) => {
  const { user_id, asset_type, name, url, description } = await c.req.json()
  
  if (!user_id || !asset_type || !name || !url) {
    return c.json({ error: 'Required fields missing' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO creator_assets (user_id, asset_type, name, url, description)
    VALUES (?, ?, ?, ?, ?)
  `).bind(user_id, asset_type, name, url, description || null).run()
  
  return c.json({ 
    success: true, 
    asset: { id: result.meta.last_row_id, user_id, asset_type, name, url }
  }, 201)
})

// Delete asset (owner only)
creatorAssets.delete('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM creator_assets WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default creatorAssets
