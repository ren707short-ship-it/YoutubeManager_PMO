import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Apply auth middleware
app.use('/*', authMiddleware)

// Sync account videos from YouTube API (owner only)
app.post('/sync/account/:accountId', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const accountId = c.req.param('accountId')
  
  // Get API key from settings
  const apiKeySetting = await c.env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('youtube_api_key').first()
  const apiEnabled = await c.env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('youtube_api_enabled').first()
  
  if (!apiEnabled || apiEnabled.value !== '1' || !apiKeySetting || !apiKeySetting.value) {
    return c.json({ error: 'YouTube API not configured' }, 400)
  }
  
  // Get account
  const account = await c.env.DB.prepare('SELECT * FROM accounts WHERE id = ?').bind(accountId).first()
  if (!account) {
    return c.json({ error: 'Account not found' }, 404)
  }
  
  if (!account.url) {
    return c.json({ error: 'Account has no YouTube channel URL' }, 400)
  }
  
  // Extract channel ID from URL
  const channelId = extractChannelId(account.url)
  if (!channelId) {
    return c.json({ error: 'Could not extract channel ID from URL' }, 400)
  }
  
  try {
    // Fetch videos from YouTube API
    const apiKey = apiKeySetting.value
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&order=date&maxResults=50`
    )
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }
    
    const data: any = await response.json()
    
    // Get detailed stats for each video
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails`
    )
    
    const statsData: any = await statsResponse.json()
    const statsMap: Record<string, any> = {}
    statsData.items.forEach((item: any) => {
      statsMap[item.id] = {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        duration: item.contentDetails.duration
      }
    })
    
    let syncedCount = 0
    
    // Process each video
    for (const item of data.items) {
      const videoId = item.id.videoId
      const snippet = item.snippet
      const stats = statsMap[videoId] || { viewCount: 0, likeCount: 0 }
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
      
      // Check if video already exists
      const existing = await c.env.DB.prepare(
        'SELECT id FROM videos WHERE youtube_url = ? OR youtube_url LIKE ?'
      ).bind(youtubeUrl, `%${videoId}%`).first()
      
      if (existing) {
        // Update existing video
        await c.env.DB.prepare(`
          UPDATE videos
          SET metrics_view_count = ?, metrics_like_count = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(stats.viewCount, stats.likeCount, existing.id).run()
      } else {
        // Create new video
        await c.env.DB.prepare(`
          INSERT INTO videos (account_id, title, status, youtube_url, published_at, metrics_view_count, metrics_like_count)
          VALUES (?, ?, 'published', ?, ?, ?, ?)
        `).bind(
          accountId,
          snippet.title,
          youtubeUrl,
          snippet.publishedAt,
          stats.viewCount,
          stats.likeCount
        ).run()
      }
      
      syncedCount++
    }
    
    // Log sync
    await c.env.DB.prepare(`
      INSERT INTO sync_logs (sync_type, account_id, status, message, synced_count)
      VALUES ('account', ?, 'success', 'Successfully synced videos', ?)
    `).bind(accountId, syncedCount).run()
    
    return c.json({ success: true, syncedCount })
  } catch (error: any) {
    // Log error
    await c.env.DB.prepare(`
      INSERT INTO sync_logs (sync_type, account_id, status, message, synced_count)
      VALUES ('account', ?, 'error', ?, 0)
    `).bind(accountId, error.message).run()
    
    return c.json({ error: error.message }, 500)
  }
})

// Sync reference channel videos (owner only)
app.post('/sync/reference/:channelId', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const channelId = c.req.param('channelId')
  
  // Get API key
  const apiKeySetting = await c.env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('youtube_api_key').first()
  const apiEnabled = await c.env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('youtube_api_enabled').first()
  
  if (!apiEnabled || apiEnabled.value !== '1' || !apiKeySetting || !apiKeySetting.value) {
    return c.json({ error: 'YouTube API not configured' }, 400)
  }
  
  // Get reference channel
  const refChannel = await c.env.DB.prepare('SELECT * FROM reference_channels WHERE id = ?').bind(channelId).first()
  if (!refChannel) {
    return c.json({ error: 'Reference channel not found' }, 404)
  }
  
  if (!refChannel.youtube_channel_id) {
    return c.json({ error: 'Reference channel has no YouTube channel ID' }, 400)
  }
  
  try {
    const apiKey = apiKeySetting.value
    const ytChannelId = refChannel.youtube_channel_id
    
    // Fetch videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${ytChannelId}&part=snippet&type=video&order=viewCount&maxResults=50`
    )
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }
    
    const data: any = await response.json()
    
    // Get detailed stats
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails`
    )
    
    const statsData: any = await statsResponse.json()
    const statsMap: Record<string, any> = {}
    statsData.items.forEach((item: any) => {
      statsMap[item.id] = {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        duration: parseDuration(item.contentDetails.duration)
      }
    })
    
    let syncedCount = 0
    
    // Process each video
    for (const item of data.items) {
      const videoId = item.id.videoId
      const snippet = item.snippet
      const stats = statsMap[videoId] || { viewCount: 0, likeCount: 0, duration: 0 }
      
      // Check if video already exists
      const existing = await c.env.DB.prepare(
        'SELECT id FROM youtube_video_data WHERE youtube_video_id = ?'
      ).bind(videoId).first()
      
      if (existing) {
        // Update existing
        await c.env.DB.prepare(`
          UPDATE youtube_video_data
          SET view_count = ?, like_count = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(stats.viewCount, stats.likeCount, existing.id).run()
      } else {
        // Insert new
        await c.env.DB.prepare(`
          INSERT INTO youtube_video_data (reference_channel_id, youtube_video_id, title, description, published_at, view_count, like_count, duration_seconds)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          channelId,
          videoId,
          snippet.title,
          snippet.description || null,
          snippet.publishedAt,
          stats.viewCount,
          stats.likeCount,
          stats.duration
        ).run()
      }
      
      syncedCount++
    }
    
    // Log sync
    await c.env.DB.prepare(`
      INSERT INTO sync_logs (sync_type, reference_channel_id, status, message, synced_count)
      VALUES ('reference', ?, 'success', 'Successfully synced reference videos', ?)
    `).bind(channelId, syncedCount).run()
    
    return c.json({ success: true, syncedCount })
  } catch (error: any) {
    // Log error
    await c.env.DB.prepare(`
      INSERT INTO sync_logs (sync_type, reference_channel_id, status, message, synced_count)
      VALUES ('reference', ?, 'error', ?, 0)
    `).bind(channelId, error.message).run()
    
    return c.json({ error: error.message }, 500)
  }
})

// Get sync logs
app.get('/sync/logs', async (c) => {
  const user = c.get('user')
  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 50'
  ).all()
  
  return c.json({ logs: results })
})

// Helper function to extract channel ID from YouTube URL
function extractChannelId(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/([^\/\?]+)/,
    /youtube\.com\/c\/([^\/\?]+)/,
    /youtube\.com\/@([^\/\?]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

// Helper function to parse ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 3600 + minutes * 60 + seconds
}

// Get YouTube video data for reference channel
app.get('/data/reference/:channelId', async (c) => {
  const channelId = c.req.param('channelId')
  const limit = c.req.query('limit') || '50'
  
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM youtube_video_data
    WHERE reference_channel_id = ?
    ORDER BY view_count DESC
    LIMIT ?
  `).bind(channelId, parseInt(limit)).all()
  
  return c.json({ videos: results })
})

// Get top performing videos (dashboard)
app.get('/top-videos', async (c) => {
  const days = c.req.query('days') || '30'
  const limit = c.req.query('limit') || '10'
  
  const { results } = await c.env.DB.prepare(`
    SELECT v.*, a.name as account_name
    FROM videos v
    LEFT JOIN accounts a ON v.account_id = a.id
    WHERE v.status = 'published'
      AND v.published_at IS NOT NULL
      AND v.published_at >= datetime('now', ? || ' days')
    ORDER BY v.metrics_view_count DESC
    LIMIT ?
  `).bind(`-${days}`, parseInt(limit)).all()
  
  return c.json({ videos: results })
})

export default app
