const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

const svg = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M1 10h22"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
};

let state = {
  lang: localStorage.getItem('lang') || 'fr',
  showUserDropdown: false,
  showLangDropdown: false,
  transactions: [],
};

async function loadTransactions() {
  try {
    const data = await api.transactions.list();
    state.transactions = data || [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    state.transactions = [];
  }
}

function render() {
  const app = document.getElementById('app');
  const currentLang = languages.find(l => l.code === state.lang) || languages[0];
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@flash.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  app.innerHTML = `
    <header class="header">
      <div class="header-left">
        <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <img src="/flash.png" alt="Flash" class="header-logo"/>
          <span class="header-brand">Flash</span>
        </a>
      </div>
      <div class="header-right">
        <a href="/html/mi-espacio.html" class="header-back-btn">← Volver</a>
        <button class="lang-pill" id="langBtn">
          ${svg.globe}
          <span class="lang-label">${currentLang.label}</span>
        </button>
        <div id="headerLangDropdown" class="user-dropdown" style="display:${state.showLangDropdown ? 'block' : 'none'};top:40px;right:0;">
          ${languages.map(lang => `
            <button class="dropdown-item ${state.lang === lang.code ? 'active' : ''}" data-lang="${lang.code}">
              <span>${lang.label}</span>
              <span style="margin-left:auto;color:var(--text-dim)">${lang.name}</span>
            </button>
          `).join('')}
        </div>
        <button class="user-btn" id="userBtn">
          <span class="user-avatar">${userInitials}</span>
          <span class="user-name">${userName}</span>
          <span class="user-chevron">▼</span>
        </button>
        <div id="userDropdown" class="user-dropdown" style="display:${state.showUserDropdown ? 'block' : 'none'};top:48px;right:0;">
          <a href="/html/mi-espacio.html" class="dropdown-item">Mi espacio</a>
          <button class="dropdown-item logout-btn" onclick="handleLogout()">Cerrar sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="space-container">
        <div class="history-card" style="margin-top:0;">
          <div class="history-header">
            <h3>Historique des transactions</h3>
            <button class="history-filter">
              Tous les types
              <span class="filter-arrow">▼</span>
            </button>
            <button class="history-filter" style="margin-left:8px;">
              Tous les status
              <span class="filter-arrow">▼</span>
            </button>
          </div>
          <div class="history-empty">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Aucune transaction n'a été effectuée</span>
          </div>
        </div>
      </div>
    </main>
  `;

  bindEvents();
}

function bindEvents() {
  document.getElementById('userBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    state.showUserDropdown = !state.showUserDropdown;
    state.showLangDropdown = false;
    updateDropdowns();
  });

  document.getElementById('langBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    state.showLangDropdown = !state.showLangDropdown;
    state.showUserDropdown = false;
    updateDropdowns();
  });

  document.querySelectorAll('.dropdown-item[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem('lang', state.lang);
      document.documentElement.lang = state.lang;
      state.showLangDropdown = false;
      updateDropdowns();
      render();
    });
  });

  document.addEventListener('click', handleClickOutside);
}

function handleClickOutside(e) {
  if (!e.target.closest('.user-btn') && !e.target.closest('.user-dropdown')) {
    state.showUserDropdown = false;
  }
  if (!e.target.closest('#langBtn') && !e.target.closest('#headerLangDropdown')) {
    state.showLangDropdown = false;
  }
  updateDropdowns();
}

function updateDropdowns() {
  const userDropdown = document.getElementById('userDropdown');
  const langDropdown = document.getElementById('headerLangDropdown');
  if (userDropdown) userDropdown.style.display = state.showUserDropdown ? 'block' : 'none';
  if (langDropdown) langDropdown.style.display = state.showLangDropdown ? 'block' : 'none';
}

function handleLogout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('token');
  window.location.href = '/html/iniciar-sesion.html';
}

(async function init() {
  await loadTransactions();
  render();
})();