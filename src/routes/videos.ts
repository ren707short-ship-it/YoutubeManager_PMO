import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const videos = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
videos.use('*', authMiddleware)

// Get all videos (filtered by role)
videos.get('/', async (c) => {
  const user = c.get('user')
  
  let query = `
    SELECT v.*, 
           a.name as account_name,
           a.genre as account_genre,
           u.name as creator_name,
           aff.internal_name as affiliate_name
    FROM videos v
    LEFT JOIN accounts a ON v.account_id = a.id
    LEFT JOIN users u ON v.assigned_creator_id = u.id
    LEFT JOIN affiliate_links aff ON v.affiliate_link_id = aff.id
  `
  
  if (user?.role === 'creator') {
    query += ' WHERE v.assigned_creator_id = ?'
    query += ' ORDER BY v.due_date ASC, v.id DESC'
    const result = await c.env.DB.prepare(query).bind(user.id).all()
    return c.json({ videos: result.results })
  } else {
    query += ' ORDER BY v.due_date ASC, v.id DESC'
    const result = await c.env.DB.prepare(query).all()
    return c.json({ videos: result.results })
  }
})

// Get video by ID
videos.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  
  const query = `
    SELECT v.*, 
           a.name as account_name,
           a.genre as account_genre,
           u.name as creator_name,
           aff.internal_name as affiliate_name,
           aff.url as affiliate_url
    FROM videos v
    LEFT JOIN accounts a ON v.account_id = a.id
    LEFT JOIN users u ON v.assigned_creator_id = u.id
    LEFT JOIN affiliate_links aff ON v.affiliate_link_id = aff.id
    WHERE v.id = ?
  `
  
  const result: any = await c.env.DB.prepare(query).bind(id).first()
  
  if (!result) {
    return c.json({ error: 'Video not found' }, 404)
  }
  
  // Check permission for creator
  if (user?.role === 'creator' && result.assigned_creator_id !== user.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  // Hide affiliate URL from creators
  if (user?.role === 'creator') {
    delete result.affiliate_url
  }
  
  return c.json({ video: result })
})

// Get videos by account ID
videos.get('/account/:accountId', async (c) => {
  const accountId = c.req.param('accountId')
  const user = c.get('user')
  
  let query = `
    SELECT v.*, 
           a.name as account_name,
           u.name as creator_name,
           aff.internal_name as affiliate_name
    FROM videos v
    LEFT JOIN accounts a ON v.account_id = a.id
    LEFT JOIN users u ON v.assigned_creator_id = u.id
    LEFT JOIN affiliate_links aff ON v.affiliate_link_id = aff.id
    WHERE v.account_id = ?
  `
  
  if (user?.role === 'creator') {
    query += ' AND v.assigned_creator_id = ?'
    query += ' ORDER BY v.status, v.due_date ASC'
    const result = await c.env.DB.prepare(query).bind(accountId, user.id).all()
    return c.json({ videos: result.results })
  } else {
    query += ' ORDER BY v.status, v.due_date ASC'
    const result = await c.env.DB.prepare(query).bind(accountId).all()
    return c.json({ videos: result.results })
  }
})

// Create new video
videos.post('/', async (c) => {
  const user = c.get('user')
  const {
    account_id,
    title,
    template_type,
    status,
    assigned_creator_id,
    due_date,
    script_text,
    script_text_en,
    asset_links,
    affiliate_link_id
  } = await c.req.json()
  
  if (!account_id || !title) {
    return c.json({ error: 'account_id and title are required' }, 400)
  }
  
  // Only owner can create videos
  if (user?.role !== 'owner') {
    return c.json({ error: 'Forbidden: Owner only' }, 403)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO videos (
      account_id, title, template_type, status, assigned_creator_id,
      due_date, script_text, script_text_en, asset_links, affiliate_link_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    account_id,
    title,
    template_type || null,
    status || 'idea',
    assigned_creator_id || null,
    due_date || null,
    script_text || null,
    script_text_en || null,
    asset_links || null,
    affiliate_link_id || null
  ).run()
  
  return c.json({ 
    success: true, 
    video: { 
      id: result.meta.last_row_id,
      account_id,
      title,
      status: status || 'idea'
    }
  }, 201)
})

// Update video
videos.put('/:id', async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  const data = await c.req.json()
  
  // Check if video exists and user has permission
  const existing: any = await c.env.DB.prepare(
    'SELECT assigned_creator_id FROM videos WHERE id = ?'
  ).bind(id).first()
  
  if (!existing) {
    return c.json({ error: 'Video not found' }, 404)
  }
  
  // Creator can only update their own videos and limited fields
  if (user?.role === 'creator') {
    if (existing.assigned_creator_id !== user.id) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    
    // Creator can only update specific fields
    const allowedFields = [
      'status', 'script_text', 'script_text_en', 'asset_links',
      'youtube_url', 'published_at', 'metrics_view_count', 'metrics_like_count'
    ]
    
    const updates: string[] = []
    const values: any[] = []
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`)
        values.push(data[field])
      }
    }
    
    if (updates.length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400)
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    await c.env.DB.prepare(
      `UPDATE videos SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run()
    
    return c.json({ success: true })
  }
  
  // Owner can update all fields
  const {
    account_id, title, template_type, status, assigned_creator_id,
    due_date, script_text, script_text_en, asset_links, affiliate_link_id,
    youtube_url, published_at, metrics_view_count, metrics_like_count
  } = data
  
  await c.env.DB.prepare(`
    UPDATE videos SET
      account_id = ?,
      title = ?,
      template_type = ?,
      status = ?,
      assigned_creator_id = ?,
      due_date = ?,
      script_text = ?,
      script_text_en = ?,
      asset_links = ?,
      affiliate_link_id = ?,
      youtube_url = ?,
      published_at = ?,
      metrics_view_count = ?,
      metrics_like_count = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    account_id !== undefined ? account_id : null,
    title !== undefined ? title : null,
    template_type || null,
    status !== undefined ? status : null,
    assigned_creator_id || null,
    due_date || null,
    script_text || null,
    script_text_en || null,
    asset_links || null,
    affiliate_link_id || null,
    youtube_url || null,
    published_at || null,
    metrics_view_count !== undefined ? metrics_view_count : 0,
    metrics_like_count !== undefined ? metrics_like_count : 0,
    id
  ).run()
  
  return c.json({ success: true })
})

// Delete video (owner only)
videos.delete('/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM videos WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default videos
