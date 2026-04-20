const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

let translations = {};

const svg = {
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  swapArrows: '<svg viewBox="0 0 48 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="18" x2="10" y2="6"/><polyline points="6 10 10 6 14 10"/><line x1="10" y1="6" x2="10" y2="18"/><polyline points="6 14 10 18 14 14"/><line x1="38" y1="18" x2="38" y2="6"/><polyline points="34 10 38 6 42 10"/><line x1="38" y1="6" x2="38" y2="18"/><polyline points="34 14 38 18 42 14"/></svg>',
  qr: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h2v2h-2zM17 17h2v2h-2zM14 17h1v1h-1z" fill="currentColor"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M1 10h22"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

function t(key) {
  return translations[key] || key;
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.innerHTML = t(key);
    }
  });
  document.title = t('comprar_sats_page_title') || 'Flash — Buy Sats';
}

let state = {
  lang: localStorage.getItem('lang') || 'fr',
  showUserDropdown: false,
  showLangDropdown: false,
  activeTab: 'buy',
  isSwapped: false,
  xofAmount: '',
  satsAmount: '',
  lightningAddress: '',
  phoneNumber: '',
  countryCode: '+225',
};

function render() {
  const app = document.getElementById('app');
  const currentLang = languages.find(l => l.code === state.lang) || languages[0];
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@flash.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  app.innerHTML = `
    <header class="header">
      <div class="header-left" onclick="window.location.href='/'" style="cursor:pointer;">
        <img src="/flash.png" alt="Flash" class="header-logo"/>
        <span class="header-brand">Flash</span>
      </div>
      <div class="header-right">
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
          <a href="/html/mi-espacio.html" class="dropdown-item" data-i18n="mi_espacio">Mi espacio</a>
          <button class="dropdown-item logout-btn" onclick="handleLogout()" data-i18n="cerrar_sesion">Cerrar sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="buy-card">
        <div class="star-decor"></div>
        <div class="card-header-tabs">
          <button class="tab ${state.activeTab === 'buy' ? 'active' : ''}" data-tab="buy" data-i18n="comprar_tab">Comprar</button>
          <button class="tab ${state.activeTab === 'sell' ? 'active' : ''}" data-tab="sell" data-i18n="vender_tab">Vender</button>
        </div>
        <div class="card-body">
          <h3 class="card-title" data-i18n="${state.activeTab === 'buy' ? 'compra_sats' : 'vende_sats'}">${state.activeTab === 'buy' ? t('compra_sats') : t('vende_sats')}</h3>

          ${state.isSwapped ? `
          <div class="amount-row">
            <div class="amount-input-wrap">
              <input type="number" class="amount-input" id="satsInput" placeholder="0" value="${state.satsAmount}"/>
              <span class="amount-currency" data-i18n="sats_label">${t('sats_label')}</span>
            </div>
          </div>
          ` : `
          <div class="amount-row">
            <div class="amount-input-wrap">
              <input type="number" class="amount-input" id="xofInput" placeholder="0.00" value="${state.xofAmount}"/>
              <span class="amount-currency" data-i18n="xof_label">${t('xof_label')}</span>
            </div>
          </div>
          `}

          <button class="swap-btn" id="swapBtn" type="button">${svg.swapArrows}</button>

          ${state.isSwapped ? `
          <div class="amount-row">
            <div class="amount-input-wrap">
              <input type="number" class="amount-input" id="xofInput" placeholder="0.00" value="${state.xofAmount}"/>
              <span class="amount-currency" data-i18n="xof_label">${t('xof_label')}</span>
            </div>
          </div>
          ` : `
          <div class="amount-row">
            <div class="amount-input-wrap">
              <input type="number" class="amount-input" id="satsInput" placeholder="0" value="${state.satsAmount}"/>
              <span class="amount-currency" data-i18n="sats_label">${t('sats_label')}</span>
            </div>
          </div>
          `}

          ${state.activeTab === 'buy' ? `
          <div style="margin-top:16px">
            <label class="field-label" data-i18n="direccion_lightning">
              ${t('direccion_lightning')}
              <button class="info-btn" onclick="showLightningInfo()">i</button>
            </label>
            <div class="input-with-qr">
              <input type="text" class="lightning-input" id="lightningInput" placeholder="nombre@flash.me" data-i18n="placeholder_lightning" value="${state.lightningAddress}"/>
              <button class="qr-btn" type="button">${svg.qr}</button>
            </div>
          </div>
          ` : ''}

          <div style="margin-top:16px">
            <label class="field-label" data-i18n="pago_movil">${t('pago_movil')}</label>
            <div class="payment-row">
              <select class="country-select" id="countrySelect">
                <option value="+225" ${state.countryCode === '+225' ? 'selected' : ''}>+225</option>
                <option value="+33" ${state.countryCode === '+33' ? 'selected' : ''}>+33</option>
                <option value="+34" ${state.countryCode === '+34' ? 'selected' : ''}>+34</option>
                <option value="+44" ${state.countryCode === '+44' ? 'selected' : ''}>+44</option>
                <option value="+351" ${state.countryCode === '+351' ? 'selected' : ''}>+351</option>
              </select>
              <input type="tel" class="phone-input" id="phoneInput" placeholder="07 00 00 00 00" data-i18n="placeholder_phone" value="${state.phoneNumber}"/>
            </div>
          </div>

          <button type="button" class="confirm-btn" id="confirmBtn" data-i18n="${state.activeTab === 'buy' ? 'compra_sats' : 'vende_sats'}">
            ${state.activeTab === 'buy' ? t('compra_sats') : t('vende_sats')}
          </button>
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
      loadTranslations(state.lang);
    });
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      render();
    });
  });

  document.getElementById('swapBtn').addEventListener('click', () => {
    const temp = state.xofAmount;
    state.xofAmount = state.satsAmount;
    state.satsAmount = temp;
    state.isSwapped = !state.isSwapped;
    render();
    setTimeout(() => {
      const btn = document.getElementById('swapBtn');
      if (btn) {
        btn.classList.add('spinning');
        setTimeout(() => btn.classList.remove('spinning'), 400);
      }
    }, 0);
  });

  document.getElementById('xofInput').addEventListener('input', (e) => {
    state.xofAmount = e.target.value;
    const rate = 0.15;
    if (state.xofAmount) {
      state.satsAmount = Math.round(parseFloat(state.xofAmount) / rate).toString();
    } else {
      state.satsAmount = '';
    }
  });

  document.getElementById('satsInput').addEventListener('input', (e) => {
    state.satsAmount = e.target.value;
    const rate = 0.15;
    if (state.satsAmount) {
      state.xofAmount = (parseFloat(state.satsAmount) * rate).toFixed(2).toString();
    } else {
      state.xofAmount = '';
    }
  });

  document.getElementById('lightningInput').addEventListener('input', (e) => {
    state.lightningAddress = e.target.value;
  });

  document.getElementById('phoneInput').addEventListener('input', (e) => {
    state.phoneNumber = e.target.value;
  });

  document.getElementById('countrySelect').addEventListener('change', (e) => {
    state.countryCode = e.target.value;
  });

  document.getElementById('confirmBtn').addEventListener('click', handleConfirm);

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

function handleConfirm() {
  if (!state.xofAmount || !state.phoneNumber) {
    showToast(t('campos_required'));
    return;
  }

  const btn = document.getElementById('confirmBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> ' + t('procesando');

  setTimeout(() => {
    showSuccessModal();
    btn.disabled = false;
    btn.innerHTML = state.activeTab === 'buy' ? t('compra_sats') : t('vende_sats');
  }, 1500);
}

function showSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">✓</div>
      <h2 data-i18n="exito">${t('exito')}</h2>
      <p class="modal-desc" data-i18n="transaccion_procesando">${t('transaccion_procesando')}</p>
      <button class="btn btn-primary btn-full" onclick="this.closest('.modal-overlay').remove()" data-i18n="cerrar">${t('cerrar')}</button>
    </div>
  `;
  document.body.appendChild(modal);
  applyTranslations();
}

function showToast(msg) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--surface);color:#fff;padding:12px 24px;border-radius:8px;z-index:1000;animation:fadeIn 0.3s';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function handleLogout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  window.location.href = '/html/iniciar-sesion.html';
}

function showLightningInfo() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card info-modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <h2 data-i18n="lightning_info_title">${t('lightning_info_title')}</h2>
      <p class="info-text" data-i18n="lightning_info_desc1">${t('lightning_info_desc1')}</p>
      <p class="info-text" data-i18n="lightning_info_desc2">${t('lightning_info_desc2')}</p>
      <ul class="info-list">
        <li data-i18n="lightning_info_format1">${t('lightning_info_format1')}</li>
        <li data-i18n="lightning_info_format2">${t('lightning_info_format2')}</li>
        <li data-i18n="lightning_info_format3">${t('lightning_info_format3')}</li>
      </ul>
      <p class="info-text" data-i18n="lightning_info_help">${t('lightning_info_help')}</p>
    </div>
  `;
  document.body.appendChild(modal);
  applyTranslations();
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  state.lang = localStorage.getItem('lang') || 'fr';
  document.documentElement.lang = state.lang;
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('vender') === '1') {
    state.activeTab = 'sell';
  }
  
  await loadTranslations(state.lang);
  render();
});
