import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'
import { authMiddleware } from '../middleware/auth'

const youtubeApi = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Apply auth middleware
youtubeApi.use('/*', authMiddleware)

// Get API settings (owner only)
youtubeApi.get('/settings', async (c) => {
  const { DB } = c.env
  const user = c.get('user')
  
  if (user?.role !== 'owner') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  try {
    const result = await DB.prepare(`
      SELECT * FROM youtube_api_settings LIMIT 1
    `).first()
    
    if (!result) {
      // Create default empty settings
      await DB.prepare(`
        INSERT INTO youtube_api_settings (api_key) VALUES ('')
      `).run()
      
      return c.json({ settings: { id: 1, api_key: '', created_at: new Date().toISOString() } })
    }
    
    return c.json({ settings: result })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Update API settings (owner only)
youtubeApi.put('/settings', async (c) => {
  const { DB } = c.env
  const user = c.get('user')
  
  if (user?.role !== 'owner') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  try {
    const body = await c.req.json()
    const { api_key } = body
    
    // Check if settings exist
    const existing = await DB.prepare(`
      SELECT id FROM youtube_api_settings LIMIT 1
    `).first()
    
    if (existing) {
      await DB.prepare(`
        UPDATE youtube_api_settings 
        SET api_key = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(api_key, existing.id).run()
    } else {
      await DB.prepare(`
        INSERT INTO youtube_api_settings (api_key) VALUES (?)
      `).bind(api_key).run()
    }
    
    return c.json({ message: 'API settings updated successfully' })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Sync channel videos (owner only)
youtubeApi.post('/sync/channel/:accountId', async (c) => {
  const { DB } = c.env
  const user = c.get('user')
  const accountId = c.req.param('accountId')
  
  if (user?.role !== 'owner') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  try {
    // Get account and API key
    const account = await DB.prepare(`
      SELECT youtube_channel_id FROM accounts WHERE id = ?
    `).bind(accountId).first()
    
    if (!account || !account.youtube_channel_id) {
      return c.json({ error: 'Account YouTube channel ID not set' }, 400)
    }
    
    const settings = await DB.prepare(`
      SELECT api_key FROM youtube_api_settings LIMIT 1
    `).first()
    
    if (!settings || !settings.api_key) {
      return c.json({ error: 'YouTube API key not configured' }, 400)
    }
    
    // Fetch videos from YouTube API
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${settings.api_key}&channelId=${account.youtube_channel_id}&part=snippet&order=date&maxResults=50&type=video`
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch videos from YouTube API' }, 500)
    }
    
    const data: any = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return c.json({ message: 'No videos found', count: 0 })
    }
    
    // For each video, fetch detailed statistics
    let synced = 0
    let created = 0
    
    for (const item of data.items) {
      const videoId = item.id.videoId
      const title = item.snippet.title
      const publishedAt = item.snippet.publishedAt
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
      
      // Fetch video statistics
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${settings.api_key}&id=${videoId}&part=statistics`
      const statsResponse = await fetch(statsUrl)
      
      if (statsResponse.ok) {
        const statsData: any = await statsResponse.json()
        const stats = statsData.items?.[0]?.statistics
        
        if (stats) {
          const viewCount = parseInt(stats.viewCount || '0')
          const likeCount = parseInt(stats.likeCount || '0')
          
          // Check if video already exists
          const existing = await DB.prepare(`
            SELECT id FROM videos WHERE youtube_url = ? OR (title = ? AND account_id = ?)
          `).bind(youtubeUrl, title, accountId).first()
          
          if (existing) {
            // Update metrics
            await DB.prepare(`
              UPDATE videos 
              SET metrics_view_count = ?, metrics_like_count = ?, youtube_url = ?, published_at = ?
              WHERE id = ?
            `).bind(viewCount, likeCount, youtubeUrl, publishedAt, existing.id).run()
            synced++
          } else {
            // Create new video record
            await DB.prepare(`
              INSERT INTO videos (account_id, title, status, youtube_url, published_at, metrics_view_count, metrics_like_count)
              VALUES (?, ?, 'published', ?, ?, ?, ?)
            `).bind(accountId, title, youtubeUrl, publishedAt, viewCount, likeCount).run()
            created++
          }
        }
      }
    }
    
    return c.json({ 
      message: 'Sync completed',
      synced,
      created,
      total: synced + created
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Sync reference channel videos (owner only)
youtubeApi.post('/sync/reference/:channelId', async (c) => {
  const { DB } = c.env
  const user = c.get('user')
  const channelId = c.req.param('channelId')
  
  if (user?.role !== 'owner') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  
  try {
    // Get reference channel
    const channel = await DB.prepare(`
      SELECT youtube_channel_id FROM reference_channels WHERE id = ?
    `).bind(channelId).first()
    
    if (!channel || !channel.youtube_channel_id) {
      return c.json({ error: 'Reference channel YouTube ID not set' }, 400)
    }
    
    const settings = await DB.prepare(`
      SELECT api_key FROM youtube_api_settings LIMIT 1
    `).first()
    
    if (!settings || !settings.api_key) {
      return c.json({ error: 'YouTube API key not configured' }, 400)
    }
    
    // Fetch videos from YouTube API
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${settings.api_key}&channelId=${channel.youtube_channel_id}&part=snippet&order=viewCount&maxResults=50&type=video`
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch videos from YouTube API' }, 500)
    }
    
    const data: any = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return c.json({ message: 'No videos found', count: 0 })
    }
    
    let synced = 0
    let created = 0
    
    for (const item of data.items) {
      const videoId = item.id.videoId
      const title = item.snippet.title
      const description = item.snippet.description
      const publishedAt = item.snippet.publishedAt
      
      // Fetch video statistics and duration
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${settings.api_key}&id=${videoId}&part=statistics,contentDetails`
      const statsResponse = await fetch(statsUrl)
      
      if (statsResponse.ok) {
        const statsData: any = await statsResponse.json()
        const videoData = statsData.items?.[0]
        
        if (videoData) {
          const stats = videoData.statistics
          const viewCount = parseInt(stats?.viewCount || '0')
          const likeCount = parseInt(stats?.likeCount || '0')
          
          // Parse duration (PT1M30S format)
          const duration = videoData.contentDetails?.duration
          let durationSeconds = 0
          if (duration) {
            const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
            if (match) {
              const minutes = parseInt(match[1] || '0')
              const seconds = parseInt(match[2] || '0')
              durationSeconds = minutes * 60 + seconds
            }
          }
          
          // Check if video already exists
          const existing = await DB.prepare(`
            SELECT id FROM reference_videos WHERE youtube_video_id = ? AND reference_channel_id = ?
          `).bind(videoId, channelId).first()
          
          if (existing) {
            // Update metrics
            await DB.prepare(`
              UPDATE reference_videos 
              SET title = ?, description = ?, view_count = ?, like_count = ?, duration_seconds = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).bind(title, description, viewCount, likeCount, durationSeconds, publishedAt, existing.id).run()
            synced++
          } else {
            // Create new reference video record
            await DB.prepare(`
              INSERT INTO reference_videos (reference_channel_id, youtube_video_id, title, description, view_count, like_count, duration_seconds, published_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(channelId, videoId, title, description, viewCount, likeCount, durationSeconds, publishedAt).run()
            created++
          }
        }
      }
    }
    
    return c.json({ 
      message: 'Sync completed',
      synced,
      created,
      total: synced + created
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    return c.json({ error: error.message }, 500)
  }
})

export default youtubeApi
