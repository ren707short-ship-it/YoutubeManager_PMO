import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const dashboard = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Apply auth middleware to all routes
dashboard.use('*', authMiddleware)

// Get dashboard data
dashboard.get('/', async (c) => {
  const user = c.get('user')
  
  if (user?.role === 'owner') {
    // Owner dashboard
    
    // Get all accounts with creator info
    const accounts = await c.env.DB.prepare(`
      SELECT a.*, u.name as creator_name
      FROM accounts a
      LEFT JOIN users u ON a.assigned_creator_id = u.id
      ORDER BY a.id DESC
    `).all()
    
    // Get video status counts
    const statusCounts = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM videos
      GROUP BY status
    `).all()
    
    // Get overdue videos
    const overdueVideos = await c.env.DB.prepare(`
      SELECT v.*, a.name as account_name, u.name as creator_name
      FROM videos v
      LEFT JOIN accounts a ON v.account_id = a.id
      LEFT JOIN users u ON v.assigned_creator_id = u.id
      WHERE v.due_date < datetime('now') 
        AND v.status NOT IN ('published', 'scheduled')
      ORDER BY v.due_date ASC
      LIMIT 10
    `).all()
    
    // Get upcoming videos (due in next 3 days)
    const upcomingVideos = await c.env.DB.prepare(`
      SELECT v.*, a.name as account_name, u.name as creator_name
      FROM videos v
      LEFT JOIN accounts a ON v.account_id = a.id
      LEFT JOIN users u ON v.assigned_creator_id = u.id
      WHERE v.due_date >= datetime('now')
        AND v.due_date <= datetime('now', '+3 days')
        AND v.status NOT IN ('published', 'scheduled')
      ORDER BY v.due_date ASC
      LIMIT 10
    `).all()
    
    // Get feedback pending videos
    const feedbackPending = await c.env.DB.prepare(`
      SELECT v.*, a.name as account_name, u.name as creator_name
      FROM videos v
      LEFT JOIN accounts a ON v.account_id = a.id
      LEFT JOIN users u ON v.assigned_creator_id = u.id
      WHERE v.feedback_required = 1 
        AND v.feedback_completed_at IS NULL
      ORDER BY v.feedback_deadline ASC
      LIMIT 20
    `).all()
    
    // Get creator statistics
    const creatorStats = await c.env.DB.prepare(`
      SELECT 
        u.id,
        u.name,
        u.status,
        COUNT(v.id) as total_videos,
        SUM(CASE WHEN v.status = 'published' THEN 1 ELSE 0 END) as published_videos,
        SUM(CASE WHEN v.feedback_required = 1 AND v.feedback_completed_at IS NULL THEN 1 ELSE 0 END) as pending_feedback
      FROM users u
      LEFT JOIN videos v ON u.id = v.assigned_creator_id
      WHERE u.role = 'creator'
      GROUP BY u.id, u.name, u.status
      ORDER BY u.name
    `).all()
    
    return c.json({
      accounts: accounts.results,
      statusCounts: statusCounts.results,
      overdueVideos: overdueVideos.results,
      upcomingVideos: upcomingVideos.results,
      feedbackPending: feedbackPending.results,
      creatorStats: creatorStats.results
    })
    
  } else {
    // Creator dashboard
    
    // Get assigned accounts
    const accounts = await c.env.DB.prepare(`
      SELECT a.*, u.name as owner_name
      FROM accounts a
      LEFT JOIN users u ON a.owner_user_id = u.id
      WHERE a.assigned_creator_id = ?
      ORDER BY a.id DESC
    `).bind(user?.id).all()
    
    // Get video status counts for this creator
    const statusCounts = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM videos
      WHERE assigned_creator_id = ?
      GROUP BY status
    `).bind(user?.id).all()
    
    // Get overdue videos for this creator
    const overdueVideos = await c.env.DB.prepare(`
      SELECT v.*, a.name as account_name
      FROM videos v
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.assigned_creator_id = ?
        AND v.due_date < datetime('now')
        AND v.status NOT IN ('published', 'scheduled')
      ORDER BY v.due_date ASC
      LIMIT 10
    `).bind(user?.id).all()
    
    // Get upcoming videos for this creator
    const upcomingVideos = await c.env.DB.prepare(`
      SELECT v.*, a.name as account_name
      FROM videos v
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.assigned_creator_id = ?
        AND v.due_date >= datetime('now')
        AND v.due_date <= datetime('now', '+3 days')
        AND v.status NOT IN ('published', 'scheduled')
      ORDER BY v.due_date ASC
      LIMIT 10
    `).bind(user?.id).all()
    
    return c.json({
      accounts: accounts.results,
      statusCounts: statusCounts.results,
      overdueVideos: overdueVideos.results,
      upcomingVideos: upcomingVideos.results
    })
  }
})

export default dashboard
