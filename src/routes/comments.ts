import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const comments = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
comments.use('*', authMiddleware)

// Get comments by video ID
comments.get('/video/:videoId', async (c) => {
  const videoId = c.req.param('videoId')
  const user = c.get('user')
  
  // Check if user has access to this video
  const video: any = await c.env.DB.prepare(
    'SELECT assigned_creator_id FROM videos WHERE id = ?'
  ).bind(videoId).first()
  
  if (!video) {
    return c.json({ error: 'Video not found' }, 404)
  }
  
  if (user?.role === 'creator' && video.assigned_creator_id !== user.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  const query = `
    SELECT c.*, u.name as user_name, u.role as user_role
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.video_id = ?
    ORDER BY c.created_at ASC
  `
  
  const result = await c.env.DB.prepare(query).bind(videoId).all()
  
  return c.json({ comments: result.results })
})

// Create comment
comments.post('/', async (c) => {
  const user = c.get('user')
  const { video_id, body } = await c.req.json()
  
  if (!video_id || !body) {
    return c.json({ error: 'video_id and body are required' }, 400)
  }
  
  // Check if user has access to this video
  const video: any = await c.env.DB.prepare(
    'SELECT assigned_creator_id FROM videos WHERE id = ?'
  ).bind(video_id).first()
  
  if (!video) {
    return c.json({ error: 'Video not found' }, 404)
  }
  
  if (user?.role === 'creator' && video.assigned_creator_id !== user.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  const result = await c.env.DB.prepare(
    'INSERT INTO comments (video_id, user_id, body) VALUES (?, ?, ?)'
  ).bind(video_id, user?.id, body).run()
  
  return c.json({ 
    success: true, 
    comment: { 
      id: result.meta.last_row_id,
      video_id,
      user_id: user?.id,
      body,
      user_name: user?.name,
      user_role: user?.role
    }
  }, 201)
})

// Delete comment
comments.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  
  // Check if comment belongs to user or user is owner
  const comment: any = await c.env.DB.prepare(
    'SELECT user_id FROM comments WHERE id = ?'
  ).bind(id).first()
  
  if (!comment) {
    return c.json({ error: 'Comment not found' }, 404)
  }
  
  if (user?.role !== 'owner' && comment.user_id !== user?.id) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  await c.env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run()
  
  return c.json({ success: true })
})

export default comments
