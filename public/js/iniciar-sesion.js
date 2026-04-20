const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

let translations = {};

const svg = {
  zap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 18l.75 2.25L8 21l-2.25.75L5 24l-.75-2.25L2 21l2.25-.75L5 18zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
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
  document.title = t('login_page_title') || 'Flash — Iniciar Sesión';
}

let state = {
  email: '', password: '',
  errors: {},
  showPassword: false,
  showLangDropdown: false,
  lang: localStorage.getItem('lang') || 'fr'
};

function render() {
  const app = document.getElementById('app');
  const currentLang = languages.find(l => l.code === state.lang) || languages[0];

  app.innerHTML = `
    <nav>
      <div class="nav-inner">
        <a href="/" class="logo">
          <img src="/flash.png" alt="Flash"/>
          <span>Flash</span>
        </a>
        <div class="nav-right">
          <a href="/" class="back-btn" data-i18n="volver">${t('volver')}</a>
          <div style="position:relative">
            <button class="nav-btn" id="langBtn">
              ${svg.globe}
              <span>${currentLang.label}</span>
            </button>
            <div id="langDropdown" class="dropdown" style="display:${state.showLangDropdown ? 'block' : 'none'}">
              ${languages.map(lang => `
                <button class="dropdown-item ${state.lang === lang.code ? 'active' : ''}" data-lang="${lang.code}">
                  <span>${lang.label}</span>
                  <span class="muted">${lang.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <div class="card animate-fadeIn" style="max-width: 900px;">
        <div class="card-grid">
          <div class="card-left">
            <h2 class="left-title" data-i18n="login_left_title">${t('login_left_title')}</h2>
            <p class="left-subtitle" data-i18n="login_left_subtitle">${t('login_left_subtitle')}</p>

            <img src="/img/log.png" alt="Flash Logo" style="width:240px;margin:12px auto;display:block;" />

            <div class="small-features">
              <span>${svg.shield} 100% sécurisé et protégé</span>
              <span>${svg.sparkles} Transaction instantanée</span>
              <span>${svg.check} Sans commission cachée</span>
            </div>
          </div>

          <div class="card-right">
            <div class="form-group">
              <label data-i18n="label_email">${t('label_email')}</label>
              <div class="input-wrap">
                ${svg.mail}
                <input type="email" id="email" placeholder="kofi@example.com" data-i18n="placeholder_email"/>
              </div>
              <p id="email-error" class="error-msg"></p>
            </div>

            <div class="form-group">
              <label data-i18n="label_password">${t('label_password')}</label>
              <div class="input-wrap">
                ${svg.lock}
                <input type="${state.showPassword ? 'text' : 'password'}" id="password" placeholder="Min. 8 caractères" data-i18n="placeholder_password"/>
                <button type="button" class="pw-toggle" id="pwToggle">
                  ${state.showPassword ? svg.eyeOff : svg.eye}
                </button>
              </div>
              <p id="password-error" class="error-msg"></p>
            </div>

            <button type="button" class="btn btn-primary btn-full" id="submitBtn" data-i18n="btn_login">
              ${t('btn_login')}
            </button>

            <div class="form-links">
              <a href="#" class="form-link" id="forgotPasswordLink" data-i18n="forgot_password_reset">${t('forgot_password_reset')}</a>
              <a href="#" class="form-link" data-i18n="activate_account">${t('activate_account')}</a>
              <a href="/html/crear-cuenta.html" class="form-link" data-i18n="no_account_signup">${t('no_account_signup')}</a>
            </div>

            
          </div>
        </div>
      </div>
    </main>

    <div id="resetPasswordModal" class="modal-overlay" style="display:none;">
      <div class="modal-card" id="resetModalContent">
        <div class="modal-icon">🔑</div>
        <h2 data-i18n="reset_password_title">${t('reset_password_title')}</h2>
        <div id="resetStep1">
          <div class="form-group" style="margin-top:16px;">
            <label data-i18n="label_email">${t('label_email')}</label>
            <input type="email" id="resetEmail" class="input" placeholder="kofi@example.com" style="width:100%;padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(30,41,59,0.8);color:#fff;font-size:14px;outline:none;"/>
          </div>
          <button class="btn btn-primary btn-full" onclick="sendResetCode()" style="margin-top:12px;" data-i18n="btn_reset_password">${t('btn_reset_password')}</button>
        </div>
        <div id="resetStep2" style="display:none;">
          <p id="resetEmailDisplay" style="color:var(--text-muted);font-size:13px;margin-bottom:16px;text-align:center;"></p>
          <div class="form-group">
            <label data-i18n="reset_code_label">${t('reset_code_label')}</label>
            <input type="text" id="resetCode" class="input" placeholder="Entrez le code reçu" style="width:100%;padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(30,41,59,0.8);color:#fff;font-size:14px;outline:none;"/>
          </div>
          <div class="form-group" style="position:relative;">
            <label data-i18n="new_password_label">${t('new_password_label')}</label>
            <input type="password" id="newPassword" class="input" placeholder="Nouveau mot de passe" style="width:100%;padding:12px;padding-right:40px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(30,41,59,0.8);color:#fff;font-size:14px;outline:none;"/>
            <button type="button" onclick="toggleResetPassword('newPassword', 'toggleNewPass')" style="position:absolute;right:10px;top:50%;transform:translateY(-25%);background:transparent;border:none;cursor:pointer;padding:4px;">${svg.eye}</button>
          </div>
          <div class="form-group" style="position:relative;">
            <label data-i18n="confirm_password_label">${t('confirm_password_label')}</label>
            <input type="password" id="confirmNewPassword" class="input" placeholder="Confirmer le nouveau mot de passe" style="width:100%;padding:12px;padding-right:40px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(30,41,59,0.8);color:#fff;font-size:14px;outline:none;"/>
            <button type="button" onclick="toggleResetPassword('confirmNewPassword', 'toggleConfirmPass')" style="position:absolute;right:10px;top:50%;transform:translateY(-25%);background:transparent;border:none;cursor:pointer;padding:4px;">${svg.eye}</button>
          </div>
          <button class="btn btn-primary btn-full" onclick="confirmResetPassword()" style="margin-top:12px;" data-i18n="btn_confirm">${t('btn_confirm')}</button>
        </div>
        <button class="btn btn-ghost btn-full" onclick="closeResetModal()" style="margin-top:8px;" data-i18n="btn_cancel">${t('btn_cancel')}</button>
      </div>
    </div>

    <div id="toast" class="hidden"></div>
  `;

  bindEvents();
}

function bindEvents() {
  document.getElementById('langBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    state.showLangDropdown = !state.showLangDropdown;
    updateDropdownUI();
  });

  document.querySelectorAll('.dropdown-item[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.lang;
      state.lang = code;
      localStorage.setItem('lang', code);
      document.documentElement.lang = code;
      state.showLangDropdown = false;
      updateDropdownUI();
      updateLangButtonUI();
      loadTranslations(code);
    });
  });

  document.getElementById('pwToggle').addEventListener('click', () => {
    state.showPassword = !state.showPassword;
    const input = document.getElementById('password');
    input.type = state.showPassword ? 'text' : 'password';
    document.getElementById('pwToggle').innerHTML = state.showPassword ? svg.eyeOff : svg.eye;
  });

  document.getElementById('email').addEventListener('input', (e) => {
    state.email = e.target.value;
    clearError('email');
  });

  document.getElementById('password').addEventListener('input', (e) => {
    state.password = e.target.value;
    clearError('password');
  });

  document.getElementById('submitBtn').addEventListener('click', handleSubmit);

  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('resetPasswordModal').style.display = 'flex';
    });
  }

  document.addEventListener('click', handleClickOutside);
}

function handleClickOutside(e) {
  if (!e.target.closest('.nav-btn') && !e.target.closest('.dropdown')) {
    state.showLangDropdown = false;
    updateDropdownUI();
  }
}

function updateDropdownUI() {
  const langDropdown = document.getElementById('langDropdown');
  if (langDropdown) langDropdown.style.display = state.showLangDropdown ? 'block' : 'none';
}

function updateLangButtonUI() {
  const currentLang = languages.find(l => l.code === state.lang) || languages[0];
  const label = document.querySelector('#langBtn span');
  if (label) label.textContent = currentLang.label;
}

function showError(field, msg) {
  state.errors[field] = msg;
  const el = document.getElementById(`${field}-error`);
  if (el) el.textContent = msg;
}

function clearError(field) {
  delete state.errors[field];
  const el = document.getElementById(`${field}-error`);
  if (el) el.textContent = '';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(email) {
  if (typeof email !== 'string') return { valid: false, error: t('toast_email_required') };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { valid: false, error: t('toast_email_required') };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: t('toast_email_invalid') };
  if (trimmed.length > 254) return { valid: false, error: t('toast_email_invalid') };
  return { valid: true, value: trimmed };
}

function validatePassword(password) {
  if (typeof password !== 'string') return { valid: false, error: t('toast_pass_required') };
  if (password.length < 8) return { valid: false, error: t('toast_pw_short') };
  if (password.length > 128) return { valid: false, error: t('toast_pw_short') };
  return { valid: true, value: password };
}

function showToastMsg(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

async function handleSubmit() {
  const errors = {};
  const email = validateEmail(state.email);
  if (!email.valid) errors.email = email.error;
  const password = validatePassword(state.password);
  if (!password.valid) errors.password = password.error;

  Object.keys(errors).forEach(field => showError(field, errors[field]));

  if (Object.keys(errors).length > 0) {
    showErrorModal(t('toast_fields'));
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> ' + t('btn_logging_in');

  // Check localStorage for user
  const storedUser = localStorage.getItem('flash_user');
  
  if (!storedUser) {
    showErrorModal('No existe cuenta con ese email. Regístrate primero.');
    btn.disabled = false;
    btn.innerHTML = t('btn_login');
    return;
  }
  
  const user = JSON.parse(storedUser);
  
  // Check if email matches
  if (user.email !== state.email) {
    showErrorModal('No existe cuenta con ese email. Regístrate primero.');
    btn.disabled = false;
    btn.innerHTML = t('btn_login');
    return;
  }
  
  // Check if password matches
  if (user.password !== state.password) {
    showErrorModal('Contraseña incorrecta.');
    btn.disabled = false;
    btn.innerHTML = t('btn_login');
    return;
  }
  
  // Login successful
  localStorage.setItem('token', 'local-token-' + Date.now());
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userEmail', user.email);
  showSuccessModal();
}

function showSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">✓</div>
      <h2 data-i18n="toast_logged_in">${t('toast_logged_in')}</h2>
      <p class="modal-subtitle" data-i18n="login_success">${t('login_success')}</p>
      <p class="modal-desc" data-i18n="login_redirect">${t('login_redirect')}</p>
    </div>
  `;
  document.body.appendChild(modal);
  applyTranslations();
  setTimeout(() => window.location.href = '/html/comprar-sats.html', 1500);
}

function showErrorModal(msg) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon error-icon">!</div>
      <h2>Error</h2>
      <p class="modal-desc">${msg}</p>
      <button class="btn btn-primary btn-full" onclick="this.closest('.modal-overlay').remove()" data-i18n="cerrar">${t('cerrar')}</button>
    </div>
  `;
  document.body.appendChild(modal);
  applyTranslations();
}

function closeResetModal() {
  document.getElementById('resetPasswordModal').style.display = 'none';
  document.getElementById('resetStep1').style.display = 'block';
  document.getElementById('resetStep2').style.display = 'none';
}

async function sendResetCode() {
  const email = document.getElementById('resetEmail').value;
  if (!email) return;
  
  try {
    await api.auth.requestPasswordReset(email);
    document.getElementById('resetEmailDisplay').textContent = email;
    document.getElementById('resetStep1').style.display = 'none';
    document.getElementById('resetStep2').style.display = 'block';
  } catch (error) {
    showToastMsg(error.message || 'Error sending reset code');
  }
}

async function confirmResetPassword() {
  const code = document.getElementById('resetCode').value;
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmNewPassword').value;
  if (!code || !newPass || !confirmPass) return;
  if (newPass !== confirmPass) {
    showToastMsg(t('passwords_not_match'));
    return;
  }
  
  const email = document.getElementById('resetEmail').value;
  
  try {
    await api.auth.resetPassword(email, code, newPass);
    closeResetModal();
    showToastMsg(t('password_reset_success'));
  } catch (error) {
    showToastMsg(error.message || 'Error resetting password');
  }
}

function toggleResetPassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.querySelector(`[onclick="toggleResetPassword('${inputId}', '${btnId}')"]`);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = svg.eyeOff;
  } else {
    input.type = 'password';
    btn.innerHTML = svg.eye;
  }
}

function showToastMsg(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

document.addEventListener('DOMContentLoaded', async () => {
  state.lang = localStorage.getItem('lang') || 'fr';
  document.documentElement.lang = state.lang;
  await loadTranslations(state.lang);
  render();
});
