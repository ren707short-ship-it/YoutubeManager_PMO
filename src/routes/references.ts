import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware, ownerOnlyMiddleware } from '../middleware/auth'

const references = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware
references.use('*', authMiddleware)

// Get reference channels for an account
references.get('/channels/account/:accountId', async (c) => {
  const accountId = c.req.param('accountId')
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM reference_channels 
    WHERE account_id = ?
    ORDER BY priority DESC, created_at DESC
  `).bind(accountId).all()
  
  return c.json({ channels: result.results })
})

// Get reference videos for a channel
references.get('/videos/channel/:channelId', async (c) => {
  const channelId = c.req.param('channelId')
  
  const result = await c.env.DB.prepare(`
    SELECT * FROM reference_videos 
    WHERE reference_channel_id = ?
    ORDER BY view_count DESC, published_at DESC
  `).bind(channelId).all()
  
  return c.json({ videos: result.results })
})

// Create reference channel (owner only)
references.post('/channels', ownerOnlyMiddleware, async (c) => {
  const { account_id, channel_name, channel_url, youtube_channel_id, description, priority } = await c.req.json()
  
  if (!account_id || !channel_name || !channel_url) {
    return c.json({ error: 'Required fields missing' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO reference_channels (account_id, channel_name, channel_url, youtube_channel_id, description, priority)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(account_id, channel_name, channel_url, youtube_channel_id || null, description || null, priority || 0).run()
  
  return c.json({ 
    success: true, 
    channel: { id: result.meta.last_row_id, account_id, channel_name, channel_url }
  }, 201)
})

// Create reference video
references.post('/videos', ownerOnlyMiddleware, async (c) => {
  const { reference_channel_id, video_title, video_url, youtube_video_id, view_count, like_count, published_at, notes } = await c.req.json()
  
  if (!reference_channel_id || !video_title || !video_url) {
    return c.json({ error: 'Required fields missing' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO reference_videos (reference_channel_id, video_title, video_url, youtube_video_id, view_count, like_count, published_at, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    reference_channel_id, video_title, video_url, 
    youtube_video_id || null, view_count || 0, like_count || 0,
    published_at || null, notes || null
  ).run()
  
  return c.json({ 
    success: true, 
    video: { id: result.meta.last_row_id, reference_channel_id, video_title, video_url }
  }, 201)
})

// Delete reference channel
references.delete('/channels/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM reference_channels WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

// Delete reference video
references.delete('/videos/:id', ownerOnlyMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare('DELETE FROM reference_videos WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default references
