// YouTube Shorts Management System - Frontend Application

// Global state
const state = {
  currentUser: null,
  currentPage: 'login',
  data: {}
};

// API utilities
const api = {
  baseURL: '/api',
  
  async request(method, endpoint, data = null) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Request failed');
      }
      throw error;
    }
  },
  
  // Auth endpoints
  async login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  },
  
  async logout() {
    return this.request('POST', '/auth/logout');
  },
  
  async getMe() {
    return this.request('GET', '/auth/me');
  },
  
  // Dashboard endpoints
  async getDashboard() {
    return this.request('GET', '/dashboard');
  },
  
  // Users endpoints
  async getUsers() {
    return this.request('GET', '/users');
  },
  
  async createUser(userData) {
    return this.request('POST', '/users', userData);
  },
  
  async updateUser(id, userData) {
    return this.request('PUT', `/users/${id}`, userData);
  },
  
  async deleteUser(id) {
    return this.request('DELETE', `/users/${id}`);
  },
  
  // Accounts endpoints
  async getAccounts() {
    return this.request('GET', '/accounts');
  },
  
  async getAccount(id) {
    return this.request('GET', `/accounts/${id}`);
  },
  
  async createAccount(accountData) {
    return this.request('POST', '/accounts', accountData);
  },
  
  async updateAccount(id, accountData) {
    return this.request('PUT', `/accounts/${id}`, accountData);
  },
  
  async deleteAccount(id) {
    return this.request('DELETE', `/accounts/${id}`);
  },
  
  // Videos endpoints
  async getVideos() {
    return this.request('GET', '/videos');
  },
  
  async getVideo(id) {
    return this.request('GET', `/videos/${id}`);
  },
  
  async getVideosByAccount(accountId) {
    return this.request('GET', `/videos/account/${accountId}`);
  },
  
  async createVideo(videoData) {
    return this.request('POST', '/videos', videoData);
  },
  
  async updateVideo(id, videoData) {
    return this.request('PUT', `/videos/${id}`, videoData);
  },
  
  async deleteVideo(id) {
    return this.request('DELETE', `/videos/${id}`);
  },
  
  // Comments endpoints
  async getComments(videoId) {
    return this.request('GET', `/comments/video/${videoId}`);
  },
  
  async createComment(commentData) {
    return this.request('POST', '/comments', commentData);
  },
  
  async deleteComment(id) {
    return this.request('DELETE', `/comments/${id}`);
  },
  
  // Ideas endpoints
  async getIdeas() {
    return this.request('GET', '/ideas');
  },
  
  async createIdea(ideaData) {
    return this.request('POST', '/ideas', ideaData);
  },
  
  async updateIdea(id, ideaData) {
    return this.request('PUT', `/ideas/${id}`, ideaData);
  },
  
  async deleteIdea(id) {
    return this.request('DELETE', `/ideas/${id}`);
  },
  
  async createVideoFromIdea(id, videoData) {
    return this.request('POST', `/ideas/${id}/create-video`, videoData);
  },
  
  // Affiliates endpoints
  async getAffiliates() {
    return this.request('GET', '/affiliates');
  },
  
  async createAffiliate(affiliateData) {
    return this.request('POST', '/affiliates', affiliateData);
  },
  
  async updateAffiliate(id, affiliateData) {
    return this.request('PUT', `/affiliates/${id}`, affiliateData);
  },
  
  async deleteAffiliate(id) {
    return this.request('DELETE', `/affiliates/${id}`);
  },
  
  // Creator Assets endpoints
  async getCreatorAssets(userId) {
    return this.request('GET', `/creator-assets/user/${userId}`);
  },
  
  async createCreatorAsset(assetData) {
    return this.request('POST', '/creator-assets', assetData);
  },
  
  async deleteCreatorAsset(id) {
    return this.request('DELETE', `/creator-assets/${id}`);
  },
  
  // Reference Channels endpoints
  async getReferenceChannels(accountId) {
    return this.request('GET', `/references/channels/account/${accountId}`);
  },
  
  async getReferenceVideos(channelId) {
    return this.request('GET', `/references/videos/channel/${channelId}`);
  },
  
  async createReferenceChannel(channelData) {
    return this.request('POST', '/references/channels', channelData);
  },
  
  async createReferenceVideo(videoData) {
    return this.request('POST', '/references/videos', videoData);
  },
  
  async deleteReferenceChannel(id) {
    return this.request('DELETE', `/references/channels/${id}`);
  },
  
  // Account Assets endpoints
  async getAccountAssets(accountId) {
    return this.request('GET', `/account-assets/account/${accountId}`);
  },
  
  async createAccountAsset(assetData) {
    return this.request('POST', '/account-assets', assetData);
  },
  
  async updateAccountAsset(id, assetData) {
    return this.request('PUT', `/account-assets/${id}`, assetData);
  },
  
  async deleteAccountAsset(id) {
    return this.request('DELETE', `/account-assets/${id}`);
  },
  
  // v2: Templates endpoints
  async getTemplates(category = null) {
    const url = category ? `/templates?category=${category}` : '/templates';
    return this.request('GET', url);
  },
  
  async getTemplate(id) {
    return this.request('GET', `/templates/${id}`);
  },
  
  async createTemplate(templateData) {
    return this.request('POST', '/templates', templateData);
  },
  
  async updateTemplate(id, templateData) {
    return this.request('PUT', `/templates/${id}`, templateData);
  },
  
  async deleteTemplate(id) {
    return this.request('DELETE', `/templates/${id}`);
  },
  
  async getTemplateCategories() {
    return this.request('GET', '/templates/meta/categories');
  },
  
  // v2: Manuals endpoints
  async getManuals(category = null) {
    const url = category ? `/manuals?category=${category}` : '/manuals';
    return this.request('GET', url);
  },
  
  async getManual(id) {
    return this.request('GET', `/manuals/${id}`);
  },
  
  async createManual(manualData) {
    return this.request('POST', '/manuals', manualData);
  },
  
  async updateManual(id, manualData) {
    return this.request('PUT', `/manuals/${id}`, manualData);
  },
  
  async deleteManual(id) {
    return this.request('DELETE', `/manuals/${id}`);
  },
  
  async getManualCategories() {
    return this.request('GET', '/manuals/meta/categories');
  },
  
  // v2: Settings endpoints
  async getSettings() {
    return this.request('GET', '/settings');
  },
  
  async updateSetting(key, value) {
    return this.request('PUT', `/settings/${key}`, { value });
  },
  
  // v2: YouTube API endpoints
  async syncAccountVideos(accountId) {
    return this.request('POST', `/youtube/sync/account/${accountId}`);
  },
  
  async syncReferenceChannel(channelId) {
    return this.request('POST', `/youtube/sync/reference/${channelId}`);
  },
  
  async getSyncLogs() {
    return this.request('GET', '/youtube/sync/logs');
  },
  
  async getReferenceChannelData(channelId, limit = 50) {
    return this.request('GET', `/youtube/data/reference/${channelId}?limit=${limit}`);
  },
  
  async getTopVideos(days = 30, limit = 10) {
    return this.request('GET', `/youtube/top-videos?days=${days}&limit=${limit}`);
  }
};

// Utility functions
const utils = {
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  
  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  isOverdue(dueDate) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  },
  
  getStatusBadgeClass(status) {
    const classes = {
      'idea': 'bg-gray-200 text-gray-800',
      'script': 'bg-blue-200 text-blue-800',
      'editing': 'bg-yellow-200 text-yellow-800',
      'review': 'bg-purple-200 text-purple-800',
      'scheduled': 'bg-green-200 text-green-800',
      'published': 'bg-green-500 text-white'
    };
    return classes[status] || 'bg-gray-200 text-gray-800';
  },
  
  getStatusLabel(status) {
    const labels = {
      'idea': 'アイデア',
      'script': '台本中',
      'editing': '編集中',
      'review': '確認待ち',
      'scheduled': '予約済み',
      'published': '投稿済み'
    };
    return labels[status] || status;
  },
  
  showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `p-4 rounded-lg shadow-lg mb-2 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
};

function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  container.className = 'fixed top-4 right-4 z-50';
  document.body.appendChild(container);
  return container;
}

// Router
const router = {
  routes: {},
  
  register(path, handler) {
    this.routes[path] = handler;
  },
  
  async navigate(path) {
    state.currentPage = path;
    window.history.pushState({}, '', `/${path}`);
    await this.render();
  },
  
  async render() {
    const path = state.currentPage;
    const handler = this.routes[path];
    
    if (handler) {
      await handler();
    } else {
      await this.routes['404']();
    }
  }
};

// Initialize app
async function init() {
  // Check if user is logged in
  try {
    const response = await api.getMe();
    state.currentUser = response.user;
    router.navigate('dashboard');
  } catch (error) {
    router.navigate('login');
  }
  
  // Register routes
  router.register('login', renderLoginPage);
  router.register('dashboard', renderDashboardPage);
  router.register('accounts', renderAccountsPage);
  router.register('account-detail', renderAccountDetailPage);
  router.register('videos', renderVideosPage);
  router.register('video-detail', renderVideoDetailPage);
  router.register('ideas', renderIdeasPage);
  router.register('affiliates', renderAffiliatesPage);
  router.register('users', renderUsersPage);
  router.register('user-detail', renderUserDetailPage);
  router.register('production-portal', renderProductionPortalPage); // v2
  router.register('settings', renderSettingsPage); // v2
  router.register('404', render404Page);
  
  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    router.render();
  });
  
  await router.render();
}

// Page renderers
async function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center">
          <i class="fas fa-video mr-2"></i>
          YouTube Shorts 管理システム
        </h1>
        <form id="login-form">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">メールアドレス</label>
            <input type="email" id="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">パスワード</label>
            <input type="password" id="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            ログイン
          </button>
        </form>
        <div class="mt-4 text-sm text-gray-600 text-center">
          <p>初期ログイン情報:</p>
          <p>owner@example.com / password</p>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await api.login(email, password);
      state.currentUser = response.user;
      utils.showNotification('ログインしました');
      router.navigate('dashboard');
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

function renderLayout(content) {
  const app = document.getElementById('app');
  const isOwner = state.currentUser?.role === 'owner';
  
  app.innerHTML = `
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 text-white">
        <div class="p-4">
          <h1 class="text-xl font-bold">
            <i class="fas fa-video mr-2"></i>
            YouTube管理
          </h1>
        </div>
        <nav class="mt-4">
          <a href="#" onclick="router.navigate('dashboard'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'dashboard' ? 'bg-gray-700' : ''}">
            <i class="fas fa-home mr-2"></i> ダッシュボード
          </a>
          <a href="#" onclick="router.navigate('accounts'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'accounts' ? 'bg-gray-700' : ''}">
            <i class="fas fa-users mr-2"></i> アカウント
          </a>
          <a href="#" onclick="router.navigate('videos'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'videos' ? 'bg-gray-700' : ''}">
            <i class="fas fa-film mr-2"></i> 動画
          </a>
          <a href="#" onclick="router.navigate('production-portal'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'production-portal' ? 'bg-gray-700' : ''}">
            <i class="fas fa-folder-open mr-2"></i> 制作ポータル
          </a>
          ${isOwner ? `
            <a href="#" onclick="router.navigate('ideas'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'ideas' ? 'bg-gray-700' : ''}">
              <i class="fas fa-lightbulb mr-2"></i> アイデア
            </a>
            <a href="#" onclick="router.navigate('affiliates'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'affiliates' ? 'bg-gray-700' : ''}">
              <i class="fas fa-link mr-2"></i> アフィリエイト
            </a>
            <a href="#" onclick="router.navigate('users'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'users' ? 'bg-gray-700' : ''}">
              <i class="fas fa-user-cog mr-2"></i> ユーザー管理
            </a>
            <a href="#" onclick="router.navigate('settings'); return false;" class="block px-4 py-2 hover:bg-gray-700 ${state.currentPage === 'settings' ? 'bg-gray-700' : ''}">
              <i class="fas fa-cog mr-2"></i> 設定
            </a>
          ` : ''}
        </nav>
      </div>
      
      <!-- Main content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold">${getPageTitle()}</h2>
          <div class="flex items-center gap-4">
            <span class="text-gray-600">
              <i class="fas fa-user-circle mr-2"></i>
              ${state.currentUser?.name} 
              <span class="text-sm text-gray-500">(${state.currentUser?.role === 'owner' ? 'オーナー' : 'クリエイター'})</span>
            </span>
            <button onclick="handleLogout()" class="text-red-500 hover:text-red-700">
              <i class="fas fa-sign-out-alt mr-1"></i> ログアウト
            </button>
          </div>
        </header>
        
        <!-- Content -->
        <main class="flex-1 p-6 overflow-auto">
          ${content}
        </main>
      </div>
    </div>
  `;
}

function getPageTitle() {
  const titles = {
    'dashboard': 'ダッシュボード',
    'accounts': 'アカウント管理',
    'account-detail': 'アカウント詳細',
    'videos': '動画管理',
    'video-detail': '動画詳細',
    'ideas': 'アイデア管理',
    'affiliates': 'アフィリエイト管理',
    'users': 'ユーザー管理',
    'user-detail': 'ユーザー詳細',
    'production-portal': '制作ポータル',
    'settings': '設定'
  };
  return titles[state.currentPage] || 'YouTube Shorts 管理システム';
}

async function handleLogout() {
  try {
    await api.logout();
    state.currentUser = null;
    utils.showNotification('ログアウトしました');
    router.navigate('login');
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function renderDashboardPage() {
  try {
    const data = await api.getDashboard();
    state.data.dashboard = data;
    
    const isOwner = state.currentUser?.role === 'owner';
    
    // Calculate status counts
    const statusCounts = {};
    data.statusCounts.forEach(item => {
      statusCounts[item.status] = item.count;
    });
    
    const content = `
      <div class="space-y-6">
        <!-- Status cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          ${renderStatusCard('idea', 'アイデア', statusCounts.idea || 0, 'gray')}
          ${renderStatusCard('script', '台本中', statusCounts.script || 0, 'blue')}
          ${renderStatusCard('editing', '編集中', statusCounts.editing || 0, 'yellow')}
          ${renderStatusCard('review', '確認待ち', statusCounts.review || 0, 'purple')}
          ${renderStatusCard('scheduled', '予約済み', statusCounts.scheduled || 0, 'green')}
          ${renderStatusCard('published', '投稿済み', statusCounts.published || 0, 'green')}
        </div>
        
        <!-- Accounts summary -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-users mr-2"></i>
            ${isOwner ? '管理中のアカウント' : '担当アカウント'}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${data.accounts.map(account => `
              <div class="border rounded-lg p-4 hover:shadow-md transition cursor-pointer" onclick="viewAccount(${account.id})">
                <h4 class="font-semibold">${account.name}</h4>
                <p class="text-sm text-gray-600">${account.genre || '-'}</p>
                ${isOwner && account.creator_name ? `<p class="text-sm text-gray-500 mt-2">担当: ${account.creator_name}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        
        ${isOwner && data.feedbackPending && data.feedbackPending.length > 0 ? `
        <!-- Feedback Pending Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4 text-purple-600">
            <i class="fas fa-comment-dots mr-2"></i>
            フィードバック待ち (${data.feedbackPending.length})
          </h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            ${data.feedbackPending.map(video => `
              <div class="border-l-4 border-purple-500 pl-3 py-2 hover:bg-gray-50 cursor-pointer" onclick="viewVideo(${video.id})">
                <p class="font-medium">${video.title}</p>
                <p class="text-sm text-gray-600">${video.account_name} - ${video.creator_name}</p>
                ${video.feedback_deadline ? `<p class="text-xs text-purple-600">FB期限: ${utils.formatDate(video.feedback_deadline)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${isOwner && data.creatorStats ? `
        <!-- Creator Statistics -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-user-friends mr-2"></i>
            外注者統計
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">総動画数</th>
                  <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">公開済み</th>
                  <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">FB待ち</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                ${data.creatorStats.map(creator => `
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-medium">${creator.name}</td>
                    <td class="px-4 py-3">
                      <span class="inline-block px-2 py-1 rounded text-xs ${
                        creator.status === 'active' ? 'bg-green-200 text-green-800' :
                        creator.status === 'paused' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-800'
                      }">
                        ${creator.status === 'active' ? 'アクティブ' : creator.status === 'paused' ? '休止中' : '契約終了'}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-center">${creator.total_videos || 0}</td>
                    <td class="px-4 py-3 text-center">${creator.published_videos || 0}</td>
                    <td class="px-4 py-3 text-center">
                      ${creator.pending_feedback > 0 ? `<span class="text-purple-600 font-semibold">${creator.pending_feedback}</span>` : '0'}
                    </td>
                    <td class="px-4 py-3">
                      <button onclick="viewUser(${creator.id})" class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-eye"></i> 詳細
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
        
        <!-- Overdue and upcoming videos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Overdue videos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-red-600">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              期限超過 (${data.overdueVideos.length})
            </h3>
            <div class="space-y-2">
              ${data.overdueVideos.length === 0 ? '<p class="text-gray-500">期限超過の動画はありません</p>' : data.overdueVideos.map(video => `
                <div class="border-l-4 border-red-500 pl-3 py-2 hover:bg-gray-50 cursor-pointer" onclick="viewVideo(${video.id})">
                  <p class="font-medium">${video.title}</p>
                  <p class="text-sm text-gray-600">${video.account_name}</p>
                  <p class="text-xs text-red-600">期限: ${utils.formatDate(video.due_date)}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Upcoming videos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 text-orange-600">
              <i class="fas fa-clock mr-2"></i>
              期限近し (3日以内) (${data.upcomingVideos.length})
            </h3>
            <div class="space-y-2">
              ${data.upcomingVideos.length === 0 ? '<p class="text-gray-500">期限が近い動画はありません</p>' : data.upcomingVideos.map(video => `
                <div class="border-l-4 border-orange-500 pl-3 py-2 hover:bg-gray-50 cursor-pointer" onclick="viewVideo(${video.id})">
                  <p class="font-medium">${video.title}</p>
                  <p class="text-sm text-gray-600">${video.account_name}</p>
                  <p class="text-xs text-orange-600">期限: ${utils.formatDate(video.due_date)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    renderLayout(content);
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

function renderStatusCard(status, label, count, color) {
  return `
    <div class="bg-white rounded-lg shadow p-4">
      <div class="text-sm text-gray-600 mb-1">${label}</div>
      <div class="text-2xl font-bold text-${color}-600">${count}</div>
    </div>
  `;
}

function viewAccount(id) {
  state.data.selectedAccountId = id;
  router.navigate('account-detail');
}

function viewVideo(id) {
  state.data.selectedVideoId = id;
  router.navigate('video-detail');
}

function viewUser(id) {
  state.data.selectedUserId = id;
  router.navigate('user-detail');
}

// Continue in next section...
async function renderAccountsPage() {
  try {
    const data = await api.getAccounts();
    const isOwner = state.currentUser?.role === 'owner';
    
    const content = `
      <div class="space-y-4">
        ${isOwner ? `
          <div class="flex justify-end">
            <button onclick="showCreateAccountModal()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <i class="fas fa-plus mr-2"></i>新規アカウント作成
            </button>
          </div>
        ` : ''}
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アカウント名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ジャンル</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                ${isOwner ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">担当者</th>' : ''}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${data.accounts.map(account => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">${account.name}</td>
                  <td class="px-6 py-4">${account.genre || '-'}</td>
                  <td class="px-6 py-4">
                    ${account.url ? `<a href="${account.url}" target="_blank" class="text-blue-500 hover:underline"><i class="fas fa-external-link-alt"></i></a>` : '-'}
                  </td>
                  ${isOwner ? `<td class="px-6 py-4">${account.creator_name || '未割り当て'}</td>` : ''}
                  <td class="px-6 py-4">
                    <button onclick="viewAccount(${account.id})" class="text-blue-500 hover:text-blue-700 mr-2">
                      <i class="fas fa-eye"></i>
                    </button>
                    ${isOwner ? `
                      <button onclick="showEditAccountModal(${account.id})" class="text-green-500 hover:text-green-700 mr-2">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button onclick="deleteAccount(${account.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal placeholder -->
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    state.data.accounts = data.accounts;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Modal functions for accounts
async function showCreateAccountModal() {
  const users = await api.getUsers();
  const creators = users.users.filter(u => u.role === 'creator');
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">新規アカウント作成</h3>
        <form id="create-account-form">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">アカウント名 *</label>
            <input type="text" id="account-name" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">ジャンル</label>
            <input type="text" id="account-genre" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">URL</label>
            <input type="url" id="account-url" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">担当クリエイター</label>
            <select id="account-creator" class="w-full px-3 py-2 border rounded-lg">
              <option value="">未割り当て</option>
              ${creators.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">作成</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createAccount({
        name: document.getElementById('account-name').value,
        genre: document.getElementById('account-genre').value,
        url: document.getElementById('account-url').value,
        assigned_creator_id: document.getElementById('account-creator').value || null
      });
      utils.showNotification('アカウントを作成しました');
      closeModal();
      renderAccountsPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function showEditAccountModal(id) {
  const account = state.data.accounts.find(a => a.id === id);
  const users = await api.getUsers();
  const creators = users.users.filter(u => u.role === 'creator');
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">アカウント編集</h3>
        <form id="edit-account-form">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">アカウント名 *</label>
            <input type="text" id="account-name" value="${account.name}" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">ジャンル</label>
            <input type="text" id="account-genre" value="${account.genre || ''}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">URL</label>
            <input type="url" id="account-url" value="${account.url || ''}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">担当クリエイター</label>
            <select id="account-creator" class="w-full px-3 py-2 border rounded-lg">
              <option value="">未割り当て</option>
              ${creators.map(c => `<option value="${c.id}" ${c.id === account.assigned_creator_id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('edit-account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.updateAccount(id, {
        name: document.getElementById('account-name').value,
        genre: document.getElementById('account-genre').value,
        url: document.getElementById('account-url').value,
        assigned_creator_id: document.getElementById('account-creator').value || null
      });
      utils.showNotification('アカウントを更新しました');
      closeModal();
      renderAccountsPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function deleteAccount(id) {
  if (!confirm('このアカウントを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteAccount(id);
    utils.showNotification('アカウントを削除しました');
    renderAccountsPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

function closeModal() {
  document.getElementById('modal-container').innerHTML = '';
}

// Remaining page renderers will be implemented similarly...
async function renderAccountDetailPage() {
  try {
    const accountId = state.data.selectedAccountId;
    const [account, videos, assets, channels] = await Promise.all([
      api.getAccount(accountId),
      api.getVideosByAccount(accountId),
      api.getAccountAssets(accountId),
      api.getReferenceChannels(accountId)
    ]);

    // Store in state for later use
    state.data.currentAccount = account.account;
    state.data.accountAssets = assets.assets || [];
    state.data.referenceChannels = channels.channels || [];
    
    // Group videos by status
    const videosByStatus = {
      'idea': [],
      'script': [],
      'editing': [],
      'review': [],
      'scheduled': [],
      'published': []
    };
    
    videos.videos.forEach(video => {
      if (videosByStatus[video.status]) {
        videosByStatus[video.status].push(video);
      }
    });

    // Current tab
    const currentTab = state.data.accountDetailTab || 'videos';
    
    const content = `
      <div class="space-y-6">
        <!-- Account info -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold">${account.account.name}</h3>
              <p class="text-gray-600">${account.account.genre || '-'}</p>
            </div>
            <a href="${account.account.url}" target="_blank" class="text-blue-500 hover:underline">
              <i class="fas fa-external-link-alt mr-1"></i>チャンネルを開く
            </a>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">担当者:</span>
              <span class="ml-2">${account.account.creator_name || '未割り当て'}</span>
            </div>
            <div>
              <span class="text-gray-600">動画数:</span>
              <span class="ml-2">${videos.videos.length}件</span>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white rounded-lg shadow">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button onclick="switchAccountTab('videos')" class="px-6 py-3 border-b-2 font-medium text-sm ${currentTab === 'videos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                <i class="fas fa-video mr-2"></i>動画タスク
              </button>
              <button onclick="switchAccountTab('assets')" class="px-6 py-3 border-b-2 font-medium text-sm ${currentTab === 'assets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                <i class="fas fa-folder mr-2"></i>マテリアル (${state.data.accountAssets.length})
              </button>
              <button onclick="switchAccountTab('references')" class="px-6 py-3 border-b-2 font-medium text-sm ${currentTab === 'references' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                <i class="fas fa-star mr-2"></i>参照チャンネル (${state.data.referenceChannels.length})
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <div id="account-tab-content"></div>
          </div>
        </div>
      </div>
    `;
    
    renderLayout(content);
    renderAccountTabContent(currentTab);
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Switch account detail tab
function switchAccountTab(tab) {
  state.data.accountDetailTab = tab;
  renderAccountTabContent(tab);
}

// Render account tab content
function renderAccountTabContent(tab) {
  const container = document.getElementById('account-tab-content');
  if (!container) return;

  switch (tab) {
    case 'videos':
      renderAccountVideosTab();
      break;
    case 'assets':
      renderAccountAssetsTab();
      break;
    case 'references':
      renderAccountReferencesTab();
      break;
  }
}

// Render videos tab
function renderAccountVideosTab() {
  const container = document.getElementById('account-tab-content');
  const accountId = state.data.selectedAccountId;

  api.getVideosByAccount(accountId).then(videos => {
    const videosByStatus = {
      'idea': [],
      'script': [],
      'editing': [],
      'review': [],
      'scheduled': [],
      'published': []
    };
    
    videos.videos.forEach(video => {
      if (videosByStatus[video.status]) {
        videosByStatus[video.status].push(video);
      }
    });

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${Object.entries(videosByStatus).map(([status, videos]) => `
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold mb-3">
              <span class="inline-block px-2 py-1 rounded text-sm ${utils.getStatusBadgeClass(status)}">
                ${utils.getStatusLabel(status)} (${videos.length})
              </span>
            </h4>
            <div class="space-y-2">
              ${videos.map(video => `
                <div class="border rounded p-2 hover:shadow cursor-pointer ${utils.isOverdue(video.due_date) ? 'border-red-500' : ''}" 
                     onclick="viewVideo(${video.id})">
                  <p class="font-medium text-sm">${video.title}</p>
                  ${video.due_date ? `<p class="text-xs ${utils.isOverdue(video.due_date) ? 'text-red-600' : 'text-gray-600'}">
                    期限: ${utils.formatDate(video.due_date)}
                  </p>` : ''}
                </div>
              `).join('') || '<p class="text-gray-500 text-sm">なし</p>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  });
}

// Render assets tab
function renderAccountAssetsTab() {
  const container = document.getElementById('account-tab-content');
  const assets = state.data.accountAssets;
  const isOwner = state.currentUser?.role === 'owner';

  const assetsByType = {
    'video': [],
    'image': [],
    'template': [],
    'gpt': [],
    'other': []
  };

  assets.forEach(asset => {
    if (assetsByType[asset.asset_type]) {
      assetsByType[asset.asset_type].push(asset);
    }
  });

  container.innerHTML = `
    <div class="space-y-6">
      ${isOwner ? `
      <div class="flex justify-end">
        <button onclick="showAddAccountAssetModal()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <i class="fas fa-plus mr-2"></i>マテリアル追加
        </button>
      </div>
      ` : ''}

      ${Object.entries(assetsByType).map(([type, typeAssets]) => `
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <i class="fas ${getAssetIcon(type)} mr-2 text-blue-500"></i>
            ${getAssetTypeLabel(type)} (${typeAssets.length})
          </h3>
          ${typeAssets.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${typeAssets.map(asset => `
                <div class="bg-white p-3 rounded-lg shadow-sm hover:shadow flex items-center justify-between">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <i class="fas ${getAssetIcon(asset.asset_type)} text-gray-400"></i>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium truncate">${asset.name}</p>
                      ${asset.description ? `<p class="text-sm text-gray-500 truncate">${asset.description}</p>` : ''}
                    </div>
                  </div>
                  <div class="flex items-center gap-2 ml-2">
                    <a href="${asset.url}" target="_blank" class="text-blue-500 hover:text-blue-600">
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                    ${isOwner ? `
                    <button onclick="editAccountAsset(${asset.id})" class="text-gray-500 hover:text-gray-600">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAccountAsset(${asset.id})" class="text-red-500 hover:text-red-600">
                      <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500 italic">このタイプのマテリアルはありません</p>
          `}
        </div>
      `).join('')}

      ${assets.length === 0 ? `
        <div class="text-center py-12">
          <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">マテリアルがまだ登録されていません</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Render references tab
function renderAccountReferencesTab() {
  const container = document.getElementById('account-tab-content');
  const channels = state.data.referenceChannels;
  const isOwner = state.currentUser?.role === 'owner';

  container.innerHTML = `
    <div class="space-y-6">
      ${isOwner ? `
      <div class="flex justify-end">
        <button onclick="showAddReferenceChannelModal()" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          <i class="fas fa-plus mr-2"></i>参照チャンネル追加
        </button>
      </div>
      ` : ''}

      ${channels.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${channels.map(channel => `
            <div class="bg-white border rounded-lg p-4 hover:shadow">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-lg">${channel.channel_name}</h3>
                  ${channel.youtube_channel_id ? `
                    <a href="https://youtube.com/channel/${channel.youtube_channel_id}" target="_blank" class="text-sm text-blue-500 hover:underline">
                      <i class="fab fa-youtube mr-1"></i>YouTubeで見る
                    </a>
                  ` : ''}
                </div>
                ${isOwner ? `
                <button onclick="deleteReferenceChannel(${channel.id})" class="text-red-500 hover:text-red-600">
                  <i class="fas fa-trash"></i>
                </button>
                ` : ''}
              </div>
              ${channel.notes ? `<p class="text-sm text-gray-600 mb-3">${channel.notes}</p>` : ''}
              <button onclick="viewChannelVideos(${channel.id})" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
                <i class="fas fa-video mr-1"></i>参考動画を見る
              </button>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="text-center py-12">
          <i class="fas fa-star text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">参照チャンネルがまだ登録されていません</p>
          ${isOwner ? `
            <p class="text-gray-400 text-sm mt-2">成功しているチャンネルを追加して、パターンを分析しましょう</p>
          ` : ''}
        </div>
      `}
    </div>
  `;
}

// Modal: Add account asset
async function showAddAccountAssetModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">マテリアル追加</h3>
      <form id="add-account-asset-form" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2">名前 *</label>
          <input type="text" id="asset-name" class="w-full px-3 py-2 border rounded-lg" required>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">種類 *</label>
          <select id="asset-type" class="w-full px-3 py-2 border rounded-lg" required>
            <option value="video">動画</option>
            <option value="image">画像</option>
            <option value="template">テンプレート</option>
            <option value="gpt">GPT</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">URL *</label>
          <input type="url" id="asset-url" class="w-full px-3 py-2 border rounded-lg" placeholder="https://..." required>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">説明</label>
          <textarea id="asset-description" class="w-full px-3 py-2 border rounded-lg" rows="2"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">追加</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('add-account-asset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createAccountAsset({
        account_id: state.data.selectedAccountId,
        name: document.getElementById('asset-name').value,
        asset_type: document.getElementById('asset-type').value,
        url: document.getElementById('asset-url').value,
        description: document.getElementById('asset-description').value
      });
      utils.showNotification('マテリアルを追加しました');
      closeModal();
      renderAccountDetailPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

// Delete account asset
async function deleteAccountAsset(assetId) {
  if (!confirm('このマテリアルを削除してもよろしいですか？')) return;

  try {
    await api.deleteAccountAsset(assetId);
    utils.showNotification('マテリアルを削除しました');
    renderAccountDetailPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Modal: Add reference channel
async function showAddReferenceChannelModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">参照チャンネル追加</h3>
      <form id="add-reference-channel-form" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2">チャンネル名 *</label>
          <input type="text" id="channel-name" class="w-full px-3 py-2 border rounded-lg" required>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">YouTube チャンネルID</label>
          <input type="text" id="channel-youtube-id" class="w-full px-3 py-2 border rounded-lg" placeholder="UCxxxxxx...">
          <p class="text-xs text-gray-500 mt-1">チャンネルページのURLから取得できます</p>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">メモ</label>
          <textarea id="channel-notes" class="w-full px-3 py-2 border rounded-lg" rows="2" placeholder="なぜこのチャンネルを参考にするか..."></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
          <button type="submit" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">追加</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('add-reference-channel-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createReferenceChannel({
        account_id: state.data.selectedAccountId,
        channel_name: document.getElementById('channel-name').value,
        youtube_channel_id: document.getElementById('channel-youtube-id').value,
        notes: document.getElementById('channel-notes').value
      });
      utils.showNotification('参照チャンネルを追加しました');
      closeModal();
      renderAccountDetailPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

// Delete reference channel
async function deleteReferenceChannel(channelId) {
  if (!confirm('この参照チャンネルを削除してもよろしいですか？')) return;

  try {
    await api.deleteReferenceChannel(channelId);
    utils.showNotification('参照チャンネルを削除しました');
    renderAccountDetailPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// View channel videos
async function viewChannelVideos(channelId) {
  try {
    const response = await api.getReferenceVideos(channelId);
    const videos = response.videos || [];
    const channel = state.data.referenceChannels.find(c => c.id === channelId);

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">${channel.channel_name} - 参考動画</h3>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        ${state.currentUser.role === 'owner' ? `
        <div class="mb-4">
          <button onclick="showAddReferenceVideoModal(${channelId})" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            <i class="fas fa-plus mr-2"></i>参考動画追加
          </button>
        </div>
        ` : ''}

        ${videos.length > 0 ? `
          <div class="space-y-3">
            ${videos.map(video => `
              <div class="border rounded-lg p-4 hover:shadow">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold mb-2">${video.title}</h4>
                    ${video.youtube_video_id ? `
                      <a href="https://youtube.com/watch?v=${video.youtube_video_id}" target="_blank" class="text-blue-500 hover:underline text-sm">
                        <i class="fab fa-youtube mr-1"></i>YouTubeで見る
                      </a>
                    ` : ''}
                    ${video.notes ? `
                      <p class="text-sm text-gray-600 mt-2">${video.notes}</p>
                    ` : ''}
                  </div>
                  ${state.currentUser.role === 'owner' ? `
                  <button onclick="deleteReferenceVideo(${video.id}, ${channelId})" class="text-red-500 hover:text-red-600 ml-2">
                    <i class="fas fa-trash"></i>
                  </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-12">
            <i class="fas fa-video text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">参考動画がまだ登録されていません</p>
          </div>
        `}
      </div>
    `;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Modal: Add reference video
function showAddReferenceVideoModal(channelId) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">参考動画追加</h3>
      <form id="add-reference-video-form" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2">動画タイトル *</label>
          <input type="text" id="video-title" class="w-full px-3 py-2 border rounded-lg" required>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">YouTube 動画ID</label>
          <input type="text" id="video-youtube-id" class="w-full px-3 py-2 border rounded-lg" placeholder="dQw4w9WgXcQ">
          <p class="text-xs text-gray-500 mt-1">URLの ?v= の後の部分</p>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">分析メモ</label>
          <textarea id="video-notes" class="w-full px-3 py-2 border rounded-lg" rows="3" placeholder="なぜこの動画がうまくいったのか、どんなパターンが見られるか..."></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeModal(); viewChannelVideos(${channelId})" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
          <button type="submit" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">追加</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('add-reference-video-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createReferenceVideo({
        channel_id: channelId,
        title: document.getElementById('video-title').value,
        youtube_video_id: document.getElementById('video-youtube-id').value,
        notes: document.getElementById('video-notes').value
      });
      utils.showNotification('参考動画を追加しました');
      closeModal();
      viewChannelVideos(channelId);
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

// Delete reference video
async function deleteReferenceVideo(videoId, channelId) {
  if (!confirm('この参考動画を削除してもよろしいですか？')) return;

  try {
    await api.deleteReferenceVideo(videoId);
    utils.showNotification('参考動画を削除しました');
    viewChannelVideos(channelId);
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function renderVideosPage() {
  try {
    const data = await api.getVideos();
    const isOwner = state.currentUser?.role === 'owner';
    
    const content = `
      <div class="space-y-4">
        ${isOwner ? `
          <div class="flex justify-end">
            <button onclick="showCreateVideoModal()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <i class="fas fa-plus mr-2"></i>新規動画タスク作成
            </button>
          </div>
        ` : ''}
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイトル</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アカウント</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                ${isOwner ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">担当者</th>' : ''}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">期限</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${data.videos.map(video => `
                <tr class="hover:bg-gray-50 ${utils.isOverdue(video.due_date) && video.status !== 'published' ? 'bg-red-50' : ''}">
                  <td class="px-6 py-4">${video.title}</td>
                  <td class="px-6 py-4">${video.account_name}</td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-2 py-1 rounded text-xs ${utils.getStatusBadgeClass(video.status)}">
                      ${utils.getStatusLabel(video.status)}
                    </span>
                  </td>
                  ${isOwner ? `<td class="px-6 py-4">${video.creator_name || '未割り当て'}</td>` : ''}
                  <td class="px-6 py-4 ${utils.isOverdue(video.due_date) && video.status !== 'published' ? 'text-red-600 font-semibold' : ''}">
                    ${utils.formatDate(video.due_date)}
                  </td>
                  <td class="px-6 py-4">
                    <button onclick="viewVideo(${video.id})" class="text-blue-500 hover:text-blue-700">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    state.data.videos = data.videos;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function showCreateVideoModal() {
  const accounts = await api.getAccounts();
  const users = await api.getUsers();
  const creators = users.users.filter(u => u.role === 'creator');
  const affiliates = await api.getAffiliates();
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h3 class="text-lg font-semibold mb-4">新規動画タスク作成</h3>
        <form id="create-video-form" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">アカウント *</label>
              <select id="video-account" class="w-full px-3 py-2 border rounded-lg" required>
                <option value="">選択してください</option>
                ${accounts.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-2">担当クリエイター</label>
              <select id="video-creator" class="w-full px-3 py-2 border rounded-lg">
                <option value="">未割り当て</option>
                ${creators.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">タイトル *</label>
            <input type="text" id="video-title" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">テンプレートタイプ</label>
              <input type="text" id="video-template" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">ステータス</label>
              <select id="video-status" class="w-full px-3 py-2 border rounded-lg">
                <option value="idea">アイデア</option>
                <option value="script">台本中</option>
                <option value="editing">編集中</option>
                <option value="review">確認待ち</option>
                <option value="scheduled">予約済み</option>
                <option value="published">投稿済み</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">期限</label>
              <input type="datetime-local" id="video-due" class="w-full px-3 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">アフィリエイトリンク</label>
              <select id="video-affiliate" class="w-full px-3 py-2 border rounded-lg">
                <option value="">なし</option>
                ${affiliates.affiliates.map(a => `<option value="${a.id}">${a.internal_name}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">台本</label>
            <textarea id="video-script" rows="4" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">作成</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-video-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createVideo({
        account_id: document.getElementById('video-account').value,
        title: document.getElementById('video-title').value,
        template_type: document.getElementById('video-template').value,
        status: document.getElementById('video-status').value,
        assigned_creator_id: document.getElementById('video-creator').value || null,
        due_date: document.getElementById('video-due').value || null,
        script_text: document.getElementById('video-script').value,
        affiliate_link_id: document.getElementById('video-affiliate').value || null
      });
      utils.showNotification('動画タスクを作成しました');
      closeModal();
      renderVideosPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function renderVideoDetailPage() {
  try {
    const videoId = state.data.selectedVideoId;
    const videoData = await api.getVideo(videoId);
    const video = videoData.video;
    const comments = await api.getComments(videoId);
    const isOwner = state.currentUser?.role === 'owner';
    
    const content = `
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl font-semibold mb-2">${video.title}</h3>
              <p class="text-gray-600">${video.account_name}</p>
            </div>
            <span class="inline-block px-3 py-1 rounded text-sm ${utils.getStatusBadgeClass(video.status)}">
              ${utils.getStatusLabel(video.status)}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-gray-700 text-sm mb-1">担当者</label>
              <p>${video.creator_name || '未割り当て'}</p>
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-1">期限</label>
              <p class="${utils.isOverdue(video.due_date) && video.status !== 'published' ? 'text-red-600 font-semibold' : ''}">
                ${utils.formatDate(video.due_date)}
              </p>
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-1">テンプレート</label>
              <p>${video.template_type || '-'}</p>
            </div>
            <div>
              <label class="block text-gray-700 text-sm mb-1">アフィリエイトリンク</label>
              <p>${video.affiliate_name || '-'}</p>
              ${isOwner && video.affiliate_url ? `<a href="${video.affiliate_url}" target="_blank" class="text-blue-500 text-sm hover:underline">URLを開く</a>` : ''}
            </div>
          </div>
          
          ${video.script_text ? `
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2 font-semibold">台本</label>
              <div class="bg-gray-50 p-4 rounded border whitespace-pre-wrap">${video.script_text}</div>
            </div>
          ` : ''}
          
          ${video.script_text_en ? `
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2 font-semibold">台本（英訳）</label>
              <div class="bg-gray-50 p-4 rounded border whitespace-pre-wrap">${video.script_text_en}</div>
            </div>
          ` : ''}
          
          ${video.asset_links ? `
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2 font-semibold">アセットリンク</label>
              <div class="bg-gray-50 p-4 rounded border whitespace-pre-wrap">${video.asset_links}</div>
            </div>
          ` : ''}
          
          ${video.youtube_url ? `
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2 font-semibold">YouTube URL</label>
              <a href="${video.youtube_url}" target="_blank" class="text-blue-500 hover:underline">${video.youtube_url}</a>
            </div>
          ` : ''}
          
          ${video.status === 'published' ? `
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-gray-700 text-sm mb-1">再生回数</label>
                <p>${video.metrics_view_count || 0}</p>
              </div>
              <div>
                <label class="block text-gray-700 text-sm mb-1">いいね数</label>
                <p>${video.metrics_like_count || 0}</p>
              </div>
            </div>
          ` : ''}

          <!-- Feedback Status -->
          ${video.feedback_required ? `
            <div class="mt-4 p-4 rounded-lg ${video.feedback_completed_at ? 'bg-green-50 border border-green-200' : 'bg-purple-50 border border-purple-200'}">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold ${video.feedback_completed_at ? 'text-green-700' : 'text-purple-700'}">
                    <i class="fas ${video.feedback_completed_at ? 'fa-check-circle' : 'fa-clock'} mr-2"></i>
                    ${video.feedback_completed_at ? 'フィードバック完了' : 'フィードバック待ち'}
                  </p>
                  ${video.feedback_deadline && !video.feedback_completed_at ? `
                    <p class="text-sm ${utils.isOverdue(video.feedback_deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'} mt-1">
                      期限: ${utils.formatDate(video.feedback_deadline)}
                    </p>
                  ` : ''}
                  ${video.feedback_completed_at ? `
                    <p class="text-sm text-gray-600 mt-1">
                      完了日: ${utils.formatDateTime(video.feedback_completed_at)}
                    </p>
                  ` : ''}
                </div>
                ${isOwner && !video.feedback_completed_at ? `
                  <button onclick="completeFeedback(${video.id})" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                    <i class="fas fa-check mr-1"></i>完了にする
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}
          
          <div class="flex justify-end gap-2 mt-4">
            <button onclick="showEditVideoModal(${video.id})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <i class="fas fa-edit mr-2"></i>編集
            </button>
            ${isOwner ? `
              <button onclick="deleteVideo(${video.id})" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <i class="fas fa-trash mr-2"></i>削除
              </button>
            ` : ''}
          </div>
        </div>
        
        <!-- Comments section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-comments mr-2"></i>コメント
          </h3>
          
          <div class="space-y-3 mb-4">
            ${comments.comments.length === 0 ? '<p class="text-gray-500">コメントはまだありません</p>' : comments.comments.map(comment => `
              <div class="border-l-4 border-blue-500 pl-4 py-2">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold text-sm">
                      ${comment.user_name}
                      <span class="text-xs text-gray-500">(${comment.user_role === 'owner' ? 'オーナー' : 'クリエイター'})</span>
                    </p>
                    <p class="text-sm text-gray-600">${utils.formatDateTime(comment.created_at)}</p>
                  </div>
                  ${(isOwner || comment.user_id === state.currentUser?.id) ? `
                    <button onclick="deleteComment(${comment.id})" class="text-red-500 hover:text-red-700 text-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  ` : ''}
                </div>
                <p class="mt-2 whitespace-pre-wrap">${comment.body}</p>
              </div>
            `).join('')}
          </div>
          
          <form id="comment-form" class="mt-4">
            <textarea id="comment-body" rows="3" placeholder="コメントを入力..." class="w-full px-3 py-2 border rounded-lg" required></textarea>
            <div class="flex justify-end mt-2">
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <i class="fas fa-paper-plane mr-2"></i>送信
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    
    // Add comment form handler
    document.getElementById('comment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await api.createComment({
          video_id: videoId,
          body: document.getElementById('comment-body').value
        });
        utils.showNotification('コメントを投稿しました');
        renderVideoDetailPage();
      } catch (error) {
        utils.showNotification(error.message, 'error');
      }
    });
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function showEditVideoModal(id) {
  const videoData = await api.getVideo(id);
  const video = videoData.video;
  const isOwner = state.currentUser?.role === 'owner';
  
  let accounts, creators, affiliates;
  if (isOwner) {
    accounts = await api.getAccounts();
    const users = await api.getUsers();
    creators = users.users.filter(u => u.role === 'creator');
    affiliates = await api.getAffiliates();
  }
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h3 class="text-lg font-semibold mb-4">動画編集</h3>
        <form id="edit-video-form" class="space-y-4">
          ${isOwner ? `
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">アカウント *</label>
                <select id="video-account" class="w-full px-3 py-2 border rounded-lg" required>
                  ${accounts.accounts.map(a => `<option value="${a.id}" ${a.id === video.account_id ? 'selected' : ''}>${a.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-gray-700 mb-2">担当クリエイター</label>
                <select id="video-creator" class="w-full px-3 py-2 border rounded-lg">
                  <option value="">未割り当て</option>
                  ${creators.map(c => `<option value="${c.id}" ${c.id === video.assigned_creator_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 mb-2">タイトル *</label>
              <input type="text" id="video-title" value="${video.title}" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
          ` : ''}
          
          <div class="grid grid-cols-2 gap-4">
            ${isOwner ? `
              <div>
                <label class="block text-gray-700 mb-2">テンプレートタイプ</label>
                <input type="text" id="video-template" value="${video.template_type || ''}" class="w-full px-3 py-2 border rounded-lg">
              </div>
            ` : ''}
            <div>
              <label class="block text-gray-700 mb-2">ステータス</label>
              <select id="video-status" class="w-full px-3 py-2 border rounded-lg">
                <option value="idea" ${video.status === 'idea' ? 'selected' : ''}>アイデア</option>
                <option value="script" ${video.status === 'script' ? 'selected' : ''}>台本中</option>
                <option value="editing" ${video.status === 'editing' ? 'selected' : ''}>編集中</option>
                <option value="review" ${video.status === 'review' ? 'selected' : ''}>確認待ち</option>
                <option value="scheduled" ${video.status === 'scheduled' ? 'selected' : ''}>予約済み</option>
                <option value="published" ${video.status === 'published' ? 'selected' : ''}>投稿済み</option>
              </select>
            </div>
          </div>
          
          ${isOwner ? `
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">期限</label>
                <input type="datetime-local" id="video-due" value="${video.due_date ? new Date(video.due_date).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-gray-700 mb-2">アフィリエイトリンク</label>
                <select id="video-affiliate" class="w-full px-3 py-2 border rounded-lg">
                  <option value="">なし</option>
                  ${affiliates.affiliates.map(a => `<option value="${a.id}" ${a.id === video.affiliate_link_id ? 'selected' : ''}>${a.internal_name}</option>`).join('')}
                </select>
              </div>
            </div>
          ` : ''}
          
          <div>
            <label class="block text-gray-700 mb-2">台本</label>
            <textarea id="video-script" rows="4" class="w-full px-3 py-2 border rounded-lg">${video.script_text || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">台本（英訳）</label>
            <textarea id="video-script-en" rows="4" class="w-full px-3 py-2 border rounded-lg">${video.script_text_en || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">アセットリンク</label>
            <textarea id="video-assets" rows="3" class="w-full px-3 py-2 border rounded-lg">${video.asset_links || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2">YouTube URL</label>
            <input type="url" id="video-youtube-url" value="${video.youtube_url || ''}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          
          ${video.status === 'published' || isOwner ? `
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">再生回数</label>
                <input type="number" id="video-views" value="${video.metrics_view_count || 0}" class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-gray-700 mb-2">いいね数</label>
                <input type="number" id="video-likes" value="${video.metrics_like_count || 0}" class="w-full px-3 py-2 border rounded-lg">
              </div>
            </div>
          ` : ''}

          ${isOwner ? `
            <div class="border-t pt-4 mt-4">
              <h4 class="font-semibold mb-3 text-purple-700">フィードバック設定</h4>
              <div class="flex items-center gap-2 mb-3">
                <input type="checkbox" id="feedback-required" ${video.feedback_required ? 'checked' : ''} class="w-4 h-4">
                <label for="feedback-required" class="text-gray-700">フィードバックが必要</label>
              </div>
              <div id="feedback-deadline-container" ${!video.feedback_required ? 'style="display:none"' : ''}>
                <label class="block text-gray-700 mb-2">フィードバック期限</label>
                <input type="datetime-local" id="feedback-deadline" value="${video.feedback_deadline ? new Date(video.feedback_deadline).toISOString().slice(0, 16) : ''}" class="w-full px-3 py-2 border rounded-lg">
              </div>
            </div>
          ` : ''}
          
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Toggle feedback deadline visibility
  if (isOwner) {
    const feedbackCheckbox = document.getElementById('feedback-required');
    const deadlineContainer = document.getElementById('feedback-deadline-container');
    feedbackCheckbox.addEventListener('change', (e) => {
      deadlineContainer.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  document.getElementById('edit-video-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = {
        status: document.getElementById('video-status').value,
        script_text: document.getElementById('video-script').value,
        script_text_en: document.getElementById('video-script-en').value,
        asset_links: document.getElementById('video-assets').value,
        youtube_url: document.getElementById('video-youtube-url').value,
        metrics_view_count: document.getElementById('video-views')?.value || 0,
        metrics_like_count: document.getElementById('video-likes')?.value || 0
      };
      
      if (isOwner) {
        data.account_id = document.getElementById('video-account').value;
        data.title = document.getElementById('video-title').value;
        data.template_type = document.getElementById('video-template').value;
        data.assigned_creator_id = document.getElementById('video-creator').value || null;
        data.due_date = document.getElementById('video-due').value || null;
        data.affiliate_link_id = document.getElementById('video-affiliate').value || null;
        data.feedback_required = document.getElementById('feedback-required').checked ? 1 : 0;
        data.feedback_deadline = document.getElementById('feedback-deadline').value || null;
      }
      
      await api.updateVideo(id, data);
      utils.showNotification('動画を更新しました');
      closeModal();
      renderVideoDetailPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

// Complete feedback for a video
async function completeFeedback(videoId) {
  if (!confirm('フィードバックを完了にしますか？')) return;

  try {
    await api.updateVideo(videoId, {
      feedback_completed_at: new Date().toISOString()
    });
    utils.showNotification('フィードバックを完了しました');
    renderVideoDetailPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function deleteVideo(id) {
  if (!confirm('この動画タスクを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteVideo(id);
    utils.showNotification('動画を削除しました');
    router.navigate('videos');
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function deleteComment(id) {
  if (!confirm('このコメントを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteComment(id);
    utils.showNotification('コメントを削除しました');
    renderVideoDetailPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Ideas page
async function renderIdeasPage() {
  try {
    const data = await api.getIdeas();
    
    const content = `
      <div class="space-y-4">
        <div class="flex justify-end">
          <button onclick="showCreateIdeaModal()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-plus mr-2"></i>新規アイデア登録
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ジャンル</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">概要</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">優先度</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${data.ideas.map(idea => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">${idea.genre || '-'}</td>
                  <td class="px-6 py-4">
                    <div class="max-w-md">
                      ${idea.summary.substring(0, 100)}${idea.summary.length > 100 ? '...' : ''}
                    </div>
                    ${idea.reference_url ? `<a href="${idea.reference_url}" target="_blank" class="text-blue-500 text-sm hover:underline"><i class="fas fa-external-link-alt mr-1"></i>参考URL</a>` : ''}
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-2 py-1 rounded text-xs ${
                      idea.priority >= 3 ? 'bg-red-200 text-red-800' :
                      idea.priority >= 2 ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }">
                      ${idea.priority}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-2 py-1 rounded text-xs ${
                      idea.status === 'unused' ? 'bg-green-200 text-green-800' :
                      idea.status === 'in_use' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }">
                      ${idea.status === 'unused' ? '未使用' : idea.status === 'in_use' ? '使用中' : '使用済み'}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    ${idea.status === 'unused' ? `
                      <button onclick="showCreateVideoFromIdeaModal(${idea.id})" class="text-green-500 hover:text-green-700 mr-2" title="動画作成">
                        <i class="fas fa-video"></i>
                      </button>
                    ` : ''}
                    <button onclick="showEditIdeaModal(${idea.id})" class="text-blue-500 hover:text-blue-700 mr-2">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteIdea(${idea.id})" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    state.data.ideas = data.ideas;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function showCreateIdeaModal() {
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">新規アイデア登録</h3>
        <form id="create-idea-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">ジャンル</label>
            <input type="text" id="idea-genre" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">概要 *</label>
            <textarea id="idea-summary" rows="4" class="w-full px-3 py-2 border rounded-lg" required></textarea>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">参考URL</label>
            <input type="url" id="idea-reference" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">優先度</label>
            <select id="idea-priority" class="w-full px-3 py-2 border rounded-lg">
              <option value="0">0 (低)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3 (高)</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">登録</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-idea-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createIdea({
        genre: document.getElementById('idea-genre').value,
        summary: document.getElementById('idea-summary').value,
        reference_url: document.getElementById('idea-reference').value,
        priority: parseInt(document.getElementById('idea-priority').value)
      });
      utils.showNotification('アイデアを登録しました');
      closeModal();
      renderIdeasPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function showEditIdeaModal(id) {
  const idea = state.data.ideas.find(i => i.id === id);
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">アイデア編集</h3>
        <form id="edit-idea-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">ジャンル</label>
            <input type="text" id="idea-genre" value="${idea.genre || ''}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">概要 *</label>
            <textarea id="idea-summary" rows="4" class="w-full px-3 py-2 border rounded-lg" required>${idea.summary}</textarea>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">参考URL</label>
            <input type="url" id="idea-reference" value="${idea.reference_url || ''}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">優先度</label>
            <select id="idea-priority" class="w-full px-3 py-2 border rounded-lg">
              <option value="0" ${idea.priority === 0 ? 'selected' : ''}>0 (低)</option>
              <option value="1" ${idea.priority === 1 ? 'selected' : ''}>1</option>
              <option value="2" ${idea.priority === 2 ? 'selected' : ''}>2</option>
              <option value="3" ${idea.priority === 3 ? 'selected' : ''}>3 (高)</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">ステータス</label>
            <select id="idea-status" class="w-full px-3 py-2 border rounded-lg">
              <option value="unused" ${idea.status === 'unused' ? 'selected' : ''}>未使用</option>
              <option value="in_use" ${idea.status === 'in_use' ? 'selected' : ''}>使用中</option>
              <option value="used" ${idea.status === 'used' ? 'selected' : ''}>使用済み</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('edit-idea-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.updateIdea(id, {
        genre: document.getElementById('idea-genre').value,
        summary: document.getElementById('idea-summary').value,
        reference_url: document.getElementById('idea-reference').value,
        priority: parseInt(document.getElementById('idea-priority').value),
        status: document.getElementById('idea-status').value
      });
      utils.showNotification('アイデアを更新しました');
      closeModal();
      renderIdeasPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function showCreateVideoFromIdeaModal(ideaId) {
  const accounts = await api.getAccounts();
  const users = await api.getUsers();
  const creators = users.users.filter(u => u.role === 'creator');
  const idea = state.data.ideas.find(i => i.id === ideaId);
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">アイデアから動画作成</h3>
        <div class="mb-4 p-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-700 font-semibold mb-2">アイデア概要:</p>
          <p class="text-sm">${idea.summary}</p>
        </div>
        <form id="create-video-from-idea-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">アカウント *</label>
            <select id="video-account" class="w-full px-3 py-2 border rounded-lg" required>
              <option value="">選択してください</option>
              ${accounts.accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">タイトル</label>
            <input type="text" id="video-title" value="${idea.summary.substring(0, 50)}" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">担当クリエイター</label>
            <select id="video-creator" class="w-full px-3 py-2 border rounded-lg">
              <option value="">未割り当て</option>
              ${creators.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">作成</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-video-from-idea-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const result = await api.createVideoFromIdea(ideaId, {
        account_id: document.getElementById('video-account').value,
        title: document.getElementById('video-title').value,
        assigned_creator_id: document.getElementById('video-creator').value || null
      });
      utils.showNotification('アイデアから動画を作成しました');
      closeModal();
      state.data.selectedVideoId = result.video_id;
      router.navigate('video-detail');
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function deleteIdea(id) {
  if (!confirm('このアイデアを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteIdea(id);
    utils.showNotification('アイデアを削除しました');
    renderIdeasPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Affiliates page
async function renderAffiliatesPage() {
  try {
    const data = await api.getAffiliates();
    
    const content = `
      <div class="space-y-4">
        <div class="flex justify-end">
          <button onclick="showCreateAffiliateModal()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-plus mr-2"></i>新規アフィリエイトリンク登録
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">サービス名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内部名称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${data.affiliates.map(affiliate => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">${affiliate.service_name}</td>
                  <td class="px-6 py-4">${affiliate.internal_name}</td>
                  <td class="px-6 py-4">
                    ${affiliate.url ? `<a href="${affiliate.url}" target="_blank" class="text-blue-500 hover:underline"><i class="fas fa-external-link-alt"></i></a>` : '-'}
                  </td>
                  <td class="px-6 py-4">
                    <button onclick="showEditAffiliateModal(${affiliate.id})" class="text-blue-500 hover:text-blue-700 mr-2">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAffiliate(${affiliate.id})" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    state.data.affiliates = data.affiliates;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function showCreateAffiliateModal() {
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h3 class="text-lg font-semibold mb-4">新規アフィリエイトリンク登録</h3>
        <form id="create-affiliate-form" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">サービス名 *</label>
              <input type="text" id="affiliate-service" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div>
              <label class="block text-gray-700 mb-2">内部名称 *</label>
              <input type="text" id="affiliate-internal" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">URL *</label>
            <input type="url" id="affiliate-url" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">概要欄テンプレート</label>
            <textarea id="affiliate-description" rows="3" class="w-full px-3 py-2 border rounded-lg" placeholder="{url}を使用してURLを挿入できます"></textarea>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">コミュニティ投稿テンプレート</label>
            <textarea id="affiliate-community" rows="3" class="w-full px-3 py-2 border rounded-lg" placeholder="{url}を使用してURLを挿入できます"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">登録</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-affiliate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createAffiliate({
        service_name: document.getElementById('affiliate-service').value,
        internal_name: document.getElementById('affiliate-internal').value,
        url: document.getElementById('affiliate-url').value,
        description_template: document.getElementById('affiliate-description').value,
        community_template: document.getElementById('affiliate-community').value
      });
      utils.showNotification('アフィリエイトリンクを登録しました');
      closeModal();
      renderAffiliatesPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function showEditAffiliateModal(id) {
  const affiliate = state.data.affiliates.find(a => a.id === id);
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h3 class="text-lg font-semibold mb-4">アフィリエイトリンク編集</h3>
        <form id="edit-affiliate-form" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">サービス名 *</label>
              <input type="text" id="affiliate-service" value="${affiliate.service_name}" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div>
              <label class="block text-gray-700 mb-2">内部名称 *</label>
              <input type="text" id="affiliate-internal" value="${affiliate.internal_name}" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">URL *</label>
            <input type="url" id="affiliate-url" value="${affiliate.url}" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">概要欄テンプレート</label>
            <textarea id="affiliate-description" rows="3" class="w-full px-3 py-2 border rounded-lg">${affiliate.description_template || ''}</textarea>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">コミュニティ投稿テンプレート</label>
            <textarea id="affiliate-community" rows="3" class="w-full px-3 py-2 border rounded-lg">${affiliate.community_template || ''}</textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('edit-affiliate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.updateAffiliate(id, {
        service_name: document.getElementById('affiliate-service').value,
        internal_name: document.getElementById('affiliate-internal').value,
        url: document.getElementById('affiliate-url').value,
        description_template: document.getElementById('affiliate-description').value,
        community_template: document.getElementById('affiliate-community').value
      });
      utils.showNotification('アフィリエイトリンクを更新しました');
      closeModal();
      renderAffiliatesPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function deleteAffiliate(id) {
  if (!confirm('このアフィリエイトリンクを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteAffiliate(id);
    utils.showNotification('アフィリエイトリンクを削除しました');
    renderAffiliatesPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Users page
async function renderUsersPage() {
  try {
    const data = await api.getUsers();
    
    const content = `
      <div class="space-y-4">
        <div class="flex justify-end">
          <button onclick="showCreateUserModal()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-plus mr-2"></i>新規ユーザー作成
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メールアドレス</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ロール</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作成日</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${data.users.map(user => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">${user.name}</td>
                  <td class="px-6 py-4">${user.email}</td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-2 py-1 rounded text-xs ${
                      user.role === 'owner' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                    }">
                      ${user.role === 'owner' ? 'オーナー' : 'クリエイター'}
                    </span>
                  </td>
                  <td class="px-6 py-4">${utils.formatDate(user.created_at)}</td>
                  <td class="px-6 py-4">
                    <button onclick="showEditUserModal(${user.id})" class="text-blue-500 hover:text-blue-700 mr-2">
                      <i class="fas fa-edit"></i>
                    </button>
                    ${user.id !== state.currentUser?.id ? `
                      <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div id="modal-container"></div>
    `;
    
    renderLayout(content);
    state.data.users = data.users;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

async function showCreateUserModal() {
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">新規ユーザー作成</h3>
        <form id="create-user-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">名前 *</label>
            <input type="text" id="user-name" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">メールアドレス *</label>
            <input type="email" id="user-email" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">パスワード *</label>
            <input type="password" id="user-password" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">ロール *</label>
            <select id="user-role" class="w-full px-3 py-2 border rounded-lg" required>
              <option value="creator">クリエイター</option>
              <option value="owner">オーナー</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">作成</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createUser({
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        password: document.getElementById('user-password').value,
        role: document.getElementById('user-role').value
      });
      utils.showNotification('ユーザーを作成しました');
      closeModal();
      renderUsersPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function showEditUserModal(id) {
  const user = state.data.users.find(u => u.id === id);
  
  const modal = document.getElementById('modal-container');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">ユーザー編集</h3>
        <form id="edit-user-form" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">名前 *</label>
            <input type="text" id="user-name" value="${user.name}" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">メールアドレス *</label>
            <input type="email" id="user-email" value="${user.email}" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 mb-2">パスワード（変更する場合のみ）</label>
            <input type="password" id="user-password" class="w-full px-3 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-gray-700 mb-2">ロール *</label>
            <select id="user-role" class="w-full px-3 py-2 border rounded-lg" required>
              <option value="creator" ${user.role === 'creator' ? 'selected' : ''}>クリエイター</option>
              <option value="owner" ${user.role === 'owner' ? 'selected' : ''}>オーナー</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">更新</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('edit-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        role: document.getElementById('user-role').value
      };
      
      const password = document.getElementById('user-password').value;
      if (password) {
        data.password = password;
      }
      
      await api.updateUser(id, data);
      utils.showNotification('ユーザーを更新しました');
      closeModal();
      renderUsersPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

async function deleteUser(id) {
  if (!confirm('このユーザーを削除してもよろしいですか？')) return;
  
  try {
    await api.deleteUser(id);
    utils.showNotification('ユーザーを削除しました');
    renderUsersPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// User Detail Page
async function renderUserDetailPage() {
  const userId = router.getParam('id');
  if (!userId) {
    render404Page();
    return;
  }

  try {
    const [userResponse, assetsResponse] = await Promise.all([
      api.getUsers(),
      api.getCreatorAssets(userId)
    ]);

    const user = userResponse.users.find(u => u.id === parseInt(userId));
    if (!user) {
      render404Page();
      return;
    }

    const assets = assetsResponse.assets || [];

    // ステータスバッジの色
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'terminated': 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      'active': 'アクティブ',
      'paused': '一時停止',
      'terminated': '終了'
    };

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <!-- ヘッダー -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button onclick="router.navigate('users')" class="text-gray-600 hover:text-gray-800">
              <i class="fas fa-arrow-left"></i> 戻る
            </button>
            <h1 class="text-3xl font-bold text-gray-800">
              <i class="fas fa-user-circle mr-2"></i>${user.name}
            </h1>
            <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColors[user.status] || 'bg-gray-100 text-gray-800'}">
              ${statusLabels[user.status] || user.status}
            </span>
          </div>
          <button onclick="editUser(${user.id})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <i class="fas fa-edit mr-2"></i>編集
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左カラム: 基本情報とパフォーマンス -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 基本情報 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-info-circle mr-2 text-blue-500"></i>基本情報
              </h2>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">メールアドレス</p>
                  <p class="font-medium">${user.email}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">ロール</p>
                  <p class="font-medium">${user.role === 'owner' ? 'オーナー' : 'クリエイター'}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">登録日</p>
                  <p class="font-medium">${utils.formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>

            <!-- 契約情報 -->
            ${user.role === 'creator' ? `
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-file-contract mr-2 text-purple-500"></i>契約情報
              </h2>
              <div class="grid grid-cols-2 gap-4">
                ${user.contract_platform ? `
                <div>
                  <p class="text-sm text-gray-600">契約プラットフォーム</p>
                  <p class="font-medium">${user.contract_platform}</p>
                </div>
                ` : ''}
                ${user.contract_date ? `
                <div>
                  <p class="text-sm text-gray-600">契約日</p>
                  <p class="font-medium">${utils.formatDate(user.contract_date)}</p>
                </div>
                ` : ''}
                ${user.contract_document_url ? `
                <div class="col-span-2">
                  <p class="text-sm text-gray-600">契約書類</p>
                  <a href="${user.contract_document_url}" target="_blank" class="text-blue-500 hover:underline">
                    <i class="fas fa-external-link-alt mr-1"></i>契約書を開く
                  </a>
                </div>
                ` : ''}
              </div>
              ${!user.contract_platform && !user.contract_date && !user.contract_document_url ? `
                <p class="text-gray-500 italic">契約情報が登録されていません</p>
              ` : ''}
            </div>
            ` : ''}

            <!-- パフォーマンス統計 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-chart-line mr-2 text-green-500"></i>パフォーマンス
              </h2>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <p class="text-3xl font-bold text-blue-600">${user.total_videos || 0}</p>
                  <p class="text-sm text-gray-600 mt-1">総タスク数</p>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg">
                  <p class="text-3xl font-bold text-green-600">${user.published_videos || 0}</p>
                  <p class="text-sm text-gray-600 mt-1">公開済み</p>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                  <p class="text-3xl font-bold text-purple-600">${user.pending_feedback || 0}</p>
                  <p class="text-sm text-gray-600 mt-1">FB待ち</p>
                </div>
              </div>
            </div>

            <!-- 提供マテリアル -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold flex items-center">
                  <i class="fas fa-folder-open mr-2 text-orange-500"></i>提供マテリアル
                </h2>
                ${state.currentUser.role === 'owner' ? `
                <button onclick="showAddAssetModal(${user.id})" class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
                  <i class="fas fa-plus mr-1"></i>追加
                </button>
                ` : ''}
              </div>
              ${assets.length > 0 ? `
                <div class="space-y-2">
                  ${assets.map(asset => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div class="flex items-center gap-3">
                        <i class="fas ${getAssetIcon(asset.asset_type)} text-gray-600"></i>
                        <div>
                          <p class="font-medium">${asset.name}</p>
                          <p class="text-sm text-gray-500">${getAssetTypeLabel(asset.asset_type)}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <a href="${asset.url}" target="_blank" class="text-blue-500 hover:text-blue-600">
                          <i class="fas fa-external-link-alt"></i>
                        </a>
                        ${state.currentUser.role === 'owner' ? `
                        <button onclick="deleteCreatorAsset(${asset.id}, ${user.id})" class="text-red-500 hover:text-red-600">
                          <i class="fas fa-trash"></i>
                        </button>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-gray-500 italic">まだマテリアルが提供されていません</p>
              `}
            </div>
          </div>

          <!-- 右カラム: 備考とアクティビティ -->
          <div class="space-y-6">
            <!-- 備考 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-sticky-note mr-2 text-yellow-500"></i>備考
              </h2>
              ${user.notes ? `
                <p class="text-gray-700 whitespace-pre-wrap">${user.notes}</p>
              ` : `
                <p class="text-gray-500 italic">備考はありません</p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load user details:', error);
    utils.showNotification('ユーザー詳細の読み込みに失敗しました', 'error');
  }
}

// Helper functions for asset display
function getAssetIcon(assetType) {
  const icons = {
    'video': 'fa-video',
    'image': 'fa-image',
    'template': 'fa-file-alt',
    'other': 'fa-file'
  };
  return icons[assetType] || 'fa-file';
}

function getAssetTypeLabel(assetType) {
  const labels = {
    'video': '動画',
    'image': '画像',
    'template': 'テンプレート',
    'other': 'その他'
  };
  return labels[assetType] || assetType;
}

// Show modal to add creator asset
async function showAddAssetModal(userId) {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">マテリアル追加</h3>
      <form id="add-asset-form" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2">名前 *</label>
          <input type="text" id="asset-name" class="w-full px-3 py-2 border rounded-lg" required>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">種類 *</label>
          <select id="asset-type" class="w-full px-3 py-2 border rounded-lg" required>
            <option value="video">動画</option>
            <option value="image">画像</option>
            <option value="template">テンプレート</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">URL *</label>
          <input type="url" id="asset-url" class="w-full px-3 py-2 border rounded-lg" placeholder="https://..." required>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">キャンセル</button>
          <button type="submit" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">追加</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('add-asset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api.createCreatorAsset({
        user_id: userId,
        name: document.getElementById('asset-name').value,
        asset_type: document.getElementById('asset-type').value,
        url: document.getElementById('asset-url').value
      });
      utils.showNotification('マテリアルを追加しました');
      closeModal();
      renderUserDetailPage();
    } catch (error) {
      utils.showNotification(error.message, 'error');
    }
  });
}

// Delete creator asset
async function deleteCreatorAsset(assetId, userId) {
  if (!confirm('このマテリアルを削除してもよろしいですか？')) return;

  try {
    await api.deleteCreatorAsset(assetId);
    utils.showNotification('マテリアルを削除しました');
    renderUserDetailPage();
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Production Portal Page
async function renderProductionPortalPage() {
  try {
    const [templates, manuals, categories] = await Promise.all([
      api.getTemplates(),
      api.getManuals(),
      api.getTemplateCategories()
    ]);

    const allCategories = [...new Set([
      ...templates.templates.map(t => t.category),
      ...manuals.manuals.map(m => m.category)
    ])];

    const currentCategory = state.data.portalCategory || (allCategories[0] || 'fanza_intro');
    state.data.portalCategory = currentCategory;

    const categoryTemplates = templates.templates.filter(t => t.category === currentCategory);
    const categoryManuals = manuals.manuals.filter(m => m.category === currentCategory);

    const isOwner = state.currentUser?.role === 'owner';

    const content = `
      <div class="space-y-6">
        <!-- Category Tabs -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold"><i class="fas fa-folder-open mr-2 text-blue-500"></i>制作ポータル</h2>
            ${isOwner ? `
              <div class="flex gap-2">
                <button onclick="showCreateTemplateModal()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <i class="fas fa-plus mr-1"></i>テンプレート追加
                </button>
                <button onclick="showCreateManualModal()" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  <i class="fas fa-plus mr-1"></i>マニュアル追加
                </button>
              </div>
            ` : ''}
          </div>
          
          <div class="flex gap-2 border-b overflow-x-auto">
            ${allCategories.map(cat => `
              <button onclick="switchPortalCategory('${cat}')" 
                      class="px-4 py-2 border-b-2 transition ${cat === currentCategory ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-800'}">
                ${getCategoryLabel(cat)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Templates Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <i class="fas fa-file-video mr-2 text-purple-500"></i>テンプレート一覧
            </h3>
            ${categoryTemplates.length > 0 ? `
              <div class="space-y-3">
                ${categoryTemplates.map(tmpl => `
                  <div class="border rounded-lg p-4 hover:shadow">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-lg">${tmpl.name}</h4>
                        ${tmpl.description ? `<p class="text-sm text-gray-600 mt-1">${tmpl.description}</p>` : ''}
                        ${tmpl.capcut_project_url ? `
                          <a href="${tmpl.capcut_project_url}" target="_blank" class="inline-block mt-2 text-blue-500 hover:underline text-sm">
                            <i class="fas fa-download mr-1"></i>CapCutテンプレートDL
                          </a>
                        ` : ''}
                        ${tmpl.notes ? `
                          <p class="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded">
                            <i class="fas fa-exclamation-triangle mr-1"></i>${tmpl.notes}
                          </p>
                        ` : ''}
                      </div>
                      ${isOwner ? `
                        <div class="flex gap-2 ml-2">
                          <button onclick="editTemplate(${tmpl.id})" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button onclick="deleteTemplate(${tmpl.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-gray-500 italic text-center py-8">このカテゴリにはテンプレートがありません</p>
            `}
          </div>

          <!-- Manuals Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <i class="fas fa-book mr-2 text-green-500"></i>マニュアル
            </h3>
            ${categoryManuals.length > 0 ? `
              <div class="space-y-3">
                ${categoryManuals.map(manual => `
                  <div class="border rounded-lg p-4 hover:shadow">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-lg">${manual.title}</h4>
                        <button onclick="viewManual(${manual.id})" class="mt-2 text-blue-500 hover:underline text-sm">
                          <i class="fas fa-eye mr-1"></i>マニュアルを開く
                        </button>
                      </div>
                      ${isOwner ? `
                        <div class="flex gap-2 ml-2">
                          <button onclick="editManual(${manual.id})" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button onclick="deleteManual(${manual.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-gray-500 italic text-center py-8">このカテゴリにはマニュアルがありません</p>
            `}
          </div>
        </div>
      </div>
    `;

    renderLayout(content);
  } catch (error) {
    console.error('Failed to render production portal:', error);
    utils.showNotification('制作ポータルの読み込みに失敗しました', 'error');
  }
}

function switchPortalCategory(category) {
  state.data.portalCategory = category;
  renderProductionPortalPage();
}

function getCategoryLabel(category) {
  const labels = {
    'fanza_intro': 'FANZA作品紹介',
    'ai_love': 'AI恋愛',
    'celeb_gossip': '芸能人ゴシップ'
  };
  return labels[category] || category;
}

async function viewManual(id) {
  try {
    const { manual } = await api.getManual(id);
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-semibold">${manual.title}</h3>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="prose max-w-none">
          <pre class="whitespace-pre-wrap font-sans">${manual.content}</pre>
        </div>
      </div>
    `;
  } catch (error) {
    utils.showNotification(error.message, 'error');
  }
}

// Settings Page
async function renderSettingsPage() {
  if (state.currentUser?.role !== 'owner') {
    router.navigate('dashboard');
    return;
  }

  try {
    const { settings } = await api.getSettings();

    const content = `
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-6"><i class="fas fa-cog mr-2 text-gray-700"></i>システム設定</h2>
          
          <!-- YouTube API Settings -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 flex items-center">
              <i class="fab fa-youtube mr-2 text-red-500"></i>YouTube API設定
            </h3>
            <form id="youtube-api-form" class="space-y-4">
              <div>
                <label class="flex items-center mb-2">
                  <input type="checkbox" id="api-enabled" ${settings.youtube_api_enabled === '1' ? 'checked' : ''} class="mr-2">
                  <span class="font-medium">YouTube API連携を有効化</span>
                </label>
              </div>
              <div>
                <label class="block text-gray-700 mb-2">APIキー</label>
                <input type="text" id="api-key" value="${settings.youtube_api_key || ''}" 
                       class="w-full px-3 py-2 border rounded-lg" placeholder="AIzaSy...">
                <p class="text-sm text-gray-500 mt-1">
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="text-blue-500 hover:underline">
                    Google Cloud Console
                  </a>でAPIキーを取得してください
                </p>
              </div>
              <div class="flex justify-end">
                <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <i class="fas fa-save mr-2"></i>保存
                </button>
              </div>
            </form>
          </div>

          <!-- Sync Logs -->
          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">同期履歴</h3>
            <div id="sync-logs-container">
              <p class="text-gray-500">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    renderLayout(content);

    // Load sync logs
    loadSyncLogs();

    // Form handler
    document.getElementById('youtube-api-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const enabled = document.getElementById('api-enabled').checked ? '1' : '0';
        const apiKey = document.getElementById('api-key').value;

        await api.updateSetting('youtube_api_enabled', enabled);
        await api.updateSetting('youtube_api_key', apiKey);

        utils.showNotification('設定を保存しました');
      } catch (error) {
        utils.showNotification(error.message, 'error');
      }
    });
  } catch (error) {
    console.error('Failed to render settings:', error);
    utils.showNotification('設定の読み込みに失敗しました', 'error');
  }
}

async function loadSyncLogs() {
  try {
    const { logs } = await api.getSyncLogs();
    const container = document.getElementById('sync-logs-container');
    
    if (logs.length === 0) {
      container.innerHTML = '<p class="text-gray-500 italic">同期履歴はありません</p>';
      return;
    }

    container.innerHTML = `
      <div class="space-y-2">
        ${logs.slice(0, 10).map(log => `
          <div class="border rounded p-3 ${log.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium">${log.sync_type === 'account' ? 'アカウント同期' : '参照チャンネル同期'}</span>
                <span class="text-sm text-gray-600 ml-2">${utils.formatDateTime(log.created_at)}</span>
              </div>
              <span class="text-sm ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}">
                ${log.status === 'success' ? `✓ ${log.synced_count}件` : '✗ エラー'}
              </span>
            </div>
            ${log.message ? `<p class="text-sm text-gray-600 mt-1">${log.message}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Failed to load sync logs:', error);
  }
}

// 404 page
async function render404Page() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-8">ページが見つかりません</p>
        <button onclick="router.navigate('dashboard')" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ダッシュボードに戻る
        </button>
      </div>
    </div>
  `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
