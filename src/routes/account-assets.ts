import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const accountAssets = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware
accountAssets.use('*', authMiddleware)

// Get assets for an account
accountAssets.get('/account/:accountId', async (c) => {
  const accountId = c.req.param('accountId')
  const user = c.get('user')
  
  // Check if user has access to this account
  if (user?.role === 'creator') {
    const account: any = await c.env.DB.prepare(
      'SELECT assigned_creator_id FROM accounts WHERE id = ?'
    ).bind(accountId).first()
    
    if (!account || account.assigned_creator_id !== user.id) {
      return c.json({ error: 'Forbidden' }, 403)
    }
  }
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM account_assets 
    WHERE account_id = ?
    ORDER BY asset_type, created_at DESC
  `).bind(accountId).all()
  
  return c.json({ assets: result.results })
})

// Create asset (owner only)
accountAssets.post('/', ownerOnlyMiddleware, async (c) => {
  const { account_id, asset_type, name, url, description } = await c.req.json()
  
  if (!account_id || !asset_type || !name || !url) {
    return c.json({ error: 'Required fields missing' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO account_assets (account_id, asset_type, name, url, description)
    VALUES (?, ?, ?, ?, ?)
  `).bind(account_id, asset_type, name, url, description || null).run()
  
  return c.json({ 
    success: true, 
    asset: { id: result.meta.last_row_id, account_id, asset_type, name, url }
  }, 201)
})

// Update asset (owner only)
accountAssets.put('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  const { name, url, description } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE account_assets SET name = ?, url = ?, description = ?
    WHERE id = ?
  `).bind(name, url, description || null, id).run()
  
  return c.json({ success: true })
})

// Delete asset (owner only)
accountAssets.delete('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM account_assets WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default accountAssets
