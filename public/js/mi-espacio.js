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
};

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
        <a href="/html/comprar-sats.html" class="header-back-btn">← Volver</a>
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
        <div class="welcome-card">
          <div class="welcome-icon">${svg.zap}</div>
          <h1>¡Bienvenido, ${userName}!</h1>
          <p>Tu espacio personal para gestionar tus Sats y transacciones.</p>
        </div>

        <div class="menu-grid menu-grid-2col">
          <a href="/html/comprar-sats.html" class="menu-card menu-card-sats">
            <h3><div class="menu-icon">${svg.zap}</div> Sats Transactions</h3>
            <p class="menu-count">0</p>
            <span class="menu-action">Acheter</span>
          </a>

          <a href="/html/comprar-sats.html?vender=1" class="menu-card menu-card-momo">
            <h3><div class="menu-icon">${svg.history}</div> MoMo Transactions</h3>
            <p class="menu-count">0</p>
            <span class="menu-action">Vendre</span>
          </a>
        </div>

        <div class="menu-grid menu-grid-3col">
          <a href="#" class="menu-card menu-card-flashbacks" id="flashbacksCard">
            <h3><div class="menu-icon">${svg.wallet}</div> Mes Flashbacks</h3>
            <p>Flashback illustration</p>
          </a>

          <a href="#" class="menu-card menu-card-modifier" id="modifierCard">
            <h3><div class="menu-icon">${svg.settings}</div> Modifier profile</h3>
            <span class="menu-action">Modifier</span>
          </a>

          <a href="/html/history.html" class="menu-card menu-card-historique">
            <h3><div class="menu-icon">${svg.history}</div> Historique de transactions</h3>
            <span class="menu-action">Consulter</span>
          </a>
        </div>

        <div id="profileModal" class="modal-overlay" style="display:none;">
          <div class="modal-card" style="max-width:420px;">
            <h2>Modifier le profil</h2>
            <form id="profileForm">
              <div style="margin-bottom:16px;">
                <label class="field-label">Prénom</label>
                <input type="text" class="lightning-input" id="editPrenom" value="Elias" style="width:100%;">
              </div>
              <div style="margin-bottom:16px;">
                <label class="field-label">Nom</label>
                <input type="text" class="lightning-input" id="editNom" value="Ivan" style="width:100%;">
              </div>
              <div style="margin-bottom:16px;">
                <label class="field-label">Numéro</label>
                <input type="text" class="lightning-input" id="editNumero" value="+50360108693" style="width:100%;">
              </div>
              <div style="margin-bottom:16px;">
                <label class="field-label">Adresse Email</label>
                <input type="email" class="lightning-input" id="editEmail" value="ivanelias009@gmail.com" style="width:100%;">
              </div>
              <button type="submit" class="confirm-btn" style="margin-top:8px;">Enregistrer</button>
              <button type="button" class="confirm-btn" style="margin-top:8px;background:#64748b;margin-left:8px;" onclick="closeProfileModal()">Annuler</button>
            </form>
          </div>
        </div>

        <div id="flashbackModal" class="modal-overlay" style="display:none;align-items:center;justify-content:center;">
          <div id="flashbackCard" style="width:500px;background:#ffffff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.18);overflow:hidden;">
            <div style="padding:20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;">
              <div style="display:flex;align-items:center;gap:8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a3fcf"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span style="font-weight:700;color:#1a3fcf;font-size:18px;">FLASHBACK</span>
              </div>
              <div style="text-align:right;">
                <div style="font-size:14px;font-weight:600;color:#111827;">Ivan Elias</div>
                <div style="font-size:12px;color:#6b7280;">bitcoinflash.xyz</div>
              </div>
            </div>

            <div style="margin:16px;border-radius:16px;background:linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%);border:1px solid #e8eaf6;padding:24px;text-align:center;">
              <div style="font-size:14px;color:#6b7280;margin-bottom:12px;">mars 2026</div>
              <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a3fcf"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span style="font-size:52px;font-weight:900;color:#1a3fcf;">0</span>
                <span style="font-size:18px;font-weight:700;color:#1a3fcf;">Jour</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a3fcf"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div style="font-size:14px;color:#6b7280;">Non stop Stacking</div>
            </div>

            <div style="padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Sats achetés</div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:32px;font-weight:700;color:#111827;">0</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
              </div>
              <div>
                <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Sats vendues</div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span style="font-size:32px;font-weight:700;color:#111827;">0</span>
                </div>
              </div>
              <div>
                <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Total FCFA</div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:32px;font-weight:700;color:#111827;">0</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
              </div>
              <div>
                <div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Total transactions</div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span style="font-size:32px;font-weight:700;color:#111827;">0</span>
                </div>
              </div>
            </div>

            <div style="height:80px;position:relative;overflow:hidden;background:#f3f4f6;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;bottom:0;width:100%;height:56px;background:linear-gradient(90deg, #e63946, #f4a261, #2ec4b6);display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:900;font-size:18px;letter-spacing:0.5px;">Papa No Dey, Maman No Dey</span>
              </div>
            </div>
            <div style="padding:20px;display:flex;justify-content:center;gap:32px;border-top:1px solid #e5e7eb;">
              <button onclick="telechargerFlashback()" style="background:white;border:2px solid #1a3fcf;color:#1a3fcf;font-weight:600;padding:12px 32px;border-radius:12px;cursor:pointer;">Télécharger</button>
              <button onclick="partagerFlashback()" style="background:transparent;border:none;color:#111827;font-weight:600;padding:12px 32px;cursor:pointer;">Partager</button>
            </div>
          </div>
          <button onclick="closeFlashbackModal()" style="position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.5);border:none;color:white;width:40px;height:40px;border-radius:50%;font-size:24px;cursor:pointer;">×</button>
        </div>

        <div class="profile-card">
          <div class="profile-avatar">IE</div>
          <div class="profile-info">
            <div class="profile-field">
              <span class="profile-label">Prénom</span>
              <span class="profile-value">Elias</span>
            </div>
            <div class="profile-field">
              <span class="profile-label">Nom</span>
              <span class="profile-value">Ivan</span>
            </div>
            <div class="profile-field">
              <span class="profile-label">Numéro</span>
              <span class="profile-value">+50360108693</span>
            </div>
            <div class="profile-field">
              <span class="profile-label">Adresse Email</span>
              <span class="profile-value">
                ivanelias009@gmail.com
                <span class="check-icon">✓</span>
              </span>
            </div>
            <div class="level-section">
              <span class="level-text">Niveau 0 <span class="crown-icon">👑</span></span>
              <div class="level-bar">
                <div class="level-fill"></div>
              </div>
              <button class="upgrade-btn">Mettre à niveau</button>
            </div>
          </div>
        </div>

        <div class="history-card">
          <div class="history-header">
            <h3>Historique des transactions</h3>
            <button class="history-filter">
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
  window.location.href = '/html/iniciar-sesion.html';
}

function closeProfileModal() {
  document.getElementById('profileModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const flashcardsCard = document.getElementById('flashbacksCard');
  if (flashcardsCard) {
    flashcardsCard.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('flashbackModal').style.display = 'flex';
    });
  }

  const modifierCard = document.getElementById('modifierCard');
  if (modifierCard) {
    modifierCard.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('profileModal').style.display = 'flex';
    });
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prenom = document.getElementById('editPrenom').value;
      const nom = document.getElementById('editNom').value;
      const numero = document.getElementById('editNumero').value;
      const email = document.getElementById('editEmail').value;
      localStorage.setItem('userName', prenom + ' ' + nom);
      localStorage.setItem('userEmail', email);
      closeProfileModal();
      render();
    });
  }
});

function closeFlashbackModal() {
  document.getElementById('flashbackModal').style.display = 'none';
}

async function telechargerFlashback() {
  const card = document.getElementById('flashbackCard');
  if (!card) return;
  
  try {
    const html2canvas = window.html2canvas;
    if (!html2canvas) {
      alert('html2canvas not loaded');
      return;
    }
    
    const canvas = await html2canvas(card, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = 'flashback-ivan-elias.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
    alert('Error generating image');
  }
}

function partagerFlashback() {
  const shareData = {
    title: 'Mi Flashback Flash',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Shared successfully'))
      .catch((err) => console.log('Error sharing:', err));
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copiado!');
    });
  }
}

render();