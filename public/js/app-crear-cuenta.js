let translations = {};

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
  document.title = t('crear_cuenta_title') || 'Flash — Crear Cuenta';
}

const state = {
  form: {
    name: '', email: '', password: '', whatsapp: '',
    country: 'BJ', provider: '', mobileMoneyPhone: '',
    action: 'buy', amount: '5000'
  },
  lang: localStorage.getItem('lang') || 'es'
};

let phoneInstance = null;

function showSuccessModal(email) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">✓</div>
      <h2 data-i18n="cuenta_creada">${t('cuenta_creada')}</h2>
      <p data-i18n="codigo_enviado">Código de verificación (demo):</p>
      <p class="modal-email" style="font-size:24px; font-weight:bold; color:#4ade80;">123456</p>
      <a href="/html/verificar-codigo.html" class="btn btn-primary" data-i18n="verificar_codigo_btn">${t('verificar_codigo_btn')}</a>
    </div>
  `;
  document.body.appendChild(modal);
  applyTranslations();
  setTimeout(() => {
    window.location.href = '/html/verificar-codigo.html';
  }, 10000);
}

let modalEl = null;

function initDOM() {
  const root = document.getElementById('app');
  root.innerHTML = `
    <div class="top-bar">
      <div class="top-bar-left">
        <a href="/" class="nav-logo">
          <img class="nav-logo-icon" src="/flash.png" alt="Flash">
          <span class="nav-logo-text">Flash</span>
        </a>
        <a href="/" class="back-btn" data-i18n="volver">${t('volver')}</a>
      </div>
      <div class="top-bar-right">
        <button class="nav-btn" id="langBtn">
          <span>${getCurrentLangLabel()}</span>
        </button>
        <div id="langDropdown" class="dropdown" style="display:none">
          <button class="dropdown-item ${state.lang === 'es' ? 'active' : ''}" data-lang="es">ES</button>
          <button class="dropdown-item ${state.lang === 'fr' ? 'active' : ''}" data-lang="fr">FR</button>
          <button class="dropdown-item ${state.lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
          <button class="dropdown-item ${state.lang === 'pt' ? 'active' : ''}" data-lang="pt">PT</button>
        </div>
      </div>
    </div>
    <main>
      <div class="card card-grid" style="margin: 0 auto; max-width: 900px;">
        <div class="card-left">
          <h2 class="left-title" data-i18n="crear_cuenta_h2">${t('crear_cuenta_h2')}</h2>
          <p class="left-subtitle" data-i18n="crear_cuenta_subtitle">${t('crear_cuenta_subtitle')}</p>
          <div class="feature">
            <div class="feature-icon">⚡</div>
            <span data-i18n="transferencias_instantaneas">${t('transferencias_instantaneas')}</span>
          </div>
          <div class="feature">
            <div class="feature-icon">🔒</div>
            <span data-i18n="seguro">${t('seguro')}</span>
          </div>
          <div class="feature">
            <div class="feature-icon">💰</div>
            <span data-i18n="sin_comisiones">${t('sin_comisiones')}</span>
          </div>
        </div>
        <div class="card-right">
          ${renderCrearCuentaForm()}
        </div>
      </div>
    </main>
  `;
  initPwStrength();
  initPhoneInput();
  initLangDropdown();
}

function getCurrentLangLabel() {
  const labels = { es: 'ES', fr: 'FR', en: 'EN', pt: 'PT' };
  return labels[state.lang] || 'ES';
}

function initLangDropdown() {
  const btn = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');
  
  btn?.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });
  
  dropdown?.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      state.lang = item.dataset.lang;
      localStorage.setItem('lang', state.lang);
      document.querySelector('#langBtn span').textContent = getCurrentLangLabel();
      dropdown.style.display = 'none';
      loadTranslations(state.lang);
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-bar-right')) {
      dropdown.style.display = 'none';
    }
  });
}

function renderCrearCuentaForm() {
  return `
    <div class="step-tag" data-i18n="paso1_cuenta">${t('paso1_cuenta')}</div>
    <h2 data-i18n="crear_tu_cuenta">${t('crear_tu_cuenta')}</h2>
    <p class="subtitle" data-i18n="recibir_codigo">${t('recibir_codigo')}</p>
    <div class="form-row">
      <div class="form-group">
        <label data-i18n="nombre_label">${t('nombre_label')}</label>
        <input id="f-firstname" type="text" placeholder="Kofi" data-i18n="placeholder_nombre" autocomplete="given-name" oninput="clearError('f-firstname')"/>
        <span class="field-error" id="err-firstname" data-i18n="error_nombre">${t('error_nombre')}</span>
      </div>
      <div class="form-group">
        <label data-i18n="apellido_label">${t('apellido_label')}</label>
        <input id="f-lastname" type="text" placeholder="Mensah" data-i18n="placeholder_apellido" autocomplete="family-name" oninput="clearError('f-lastname')"/>
        <span class="field-error" id="err-lastname" data-i18n="error_apellido">${t('error_apellido')}</span>
      </div>
    </div>
    <div class="form-group">
      <label data-i18n="correo_label">${t('correo_label')}</label>
      <input id="f-email" type="email" placeholder="kofi@example.com" data-i18n="placeholder_correo" autocomplete="email" oninput="clearError('f-email')"/>
      <span class="field-error" id="err-email" data-i18n="error_correo">${t('error_correo')}</span>
    </div>
    <div class="form-group">
      <label data-i18n="telefono_label">${t('telefono_label')}</label>
      <input id="f-whatsapp" type="tel" class="phone-input" autocomplete="tel" oninput="filterPhoneInput(this); clearError('f-whatsapp')"/>
      <span class="field-error" id="err-whatsapp" data-i18n="error_telefono">${t('error_telefono')}</span>
    </div>
    <div class="form-group">
      <label data-i18n="contrasena_label">${t('contrasena_label')}</label>
      <div class="password-wrap">
        <input id="f-password" type="password" class="pw-input" placeholder="Mínimo 8 caracteres" data-i18n="placeholder_contrasena" oninput="updatePwStrength(this.value); clearError('f-password')"/>
        <button class="toggle-pw" onclick="togglePw('f-password',this)" type="button">👁</button>
      </div>
      <span class="field-error" id="err-password" data-i18n="error_contrasena">${t('error_contrasena')}</span>
      <div class="pw-strength-bar">
        <div class="pw-seg" id="ps1"></div>
        <div class="pw-seg" id="ps2"></div>
        <div class="pw-seg" id="ps3"></div>
        <div class="pw-seg" id="ps4"></div>
      </div>
      <div class="pw-label" id="pwLabel"></div>
    </div>
    <div class="form-group">
      <label data-i18n="confirmar_contrasena_label">${t('confirmar_contrasena_label')}</label>
      <div class="password-wrap">
        <input id="f-password2" type="password" placeholder="Repite tu contraseña" data-i18n="placeholder_confirmar" autocomplete="new-password" oninput="clearError('f-password2')"/>
        <button class="toggle-pw" onclick="togglePw('f-password2',this)" type="button">👁</button>
      </div>
      <span class="field-error" id="err-password2" data-i18n="error_contrasenas_no_coinciden">${t('error_contrasenas_no_coinciden')}</span>
    </div>
    <button class="btn btn-primary btn-full" id="btnRegister" onclick="doRegister()" data-i18n="btn_crear_cuenta">${t('btn_crear_cuenta')}</button>
    <div class="trust-row">
      <span class="trust-item">🔒 <span data-i18n="seguro">${t('seguro')}</span></span>
      <span class="trust-item">✅ <span data-i18n="sin_comisiones">${t('sin_comisiones')}</span></span>
      <span class="trust-item">⚡ <span data-i18n="transferencias_instantaneas">${t('transferencias_instantaneas')}</span></span>
    </div>
    <div class="login-link">
      <span data-i18n="login_link">${t('login_link')}</span> <a href="/html/iniciar-sesion.html" data-i18n="login_connect">${t('login_connect')}</a>
    </div>
  `;
}

function initPhoneInput() {
  const phoneInput = document.getElementById('f-whatsapp');
  if (phoneInput && window.intlTelInput) {
    phoneInstance = window.intlTelInput(phoneInput, {
      initialCountry: 'bj',
      separateDialCode: true,
      preferredCountries: ['bj', 'tg', 'ci', 'sn', 'ml', 'bf', 'ne', 'gh', 'cm', 'cd', 'cg', 'ga', 'fr', 'es', 'us', 'gb', 'br', 'pt', 'mx', 'ar', 'co', 'pe', 'cl', 've'],
      utilsScript: 'https://unpkg.com/intl-tel-input@24.7.0/build/js/utils.js'
    });
  } else {
    setTimeout(initPhoneInput, 100);
  }
}

function updatePwStrength(val) {
  const segs = [
    document.getElementById('ps1'), document.getElementById('ps2'),
    document.getElementById('ps3'), document.getElementById('ps4')
  ];
  const label = document.getElementById('pwLabel');
  const pwInput = document.getElementById('f-password');
  if (!segs[0]) return;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const labels = { weak: t('pw_weak'), medium: t('pw_medium'), strong: t('pw_strong'), vstrong: t('pw_vstrong') };
  const pwLabels = ['', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
  segs.forEach((s, i) => { s.className = 'pw-seg' + (i < score ? ' ' + cls : ''); });
  if (label) label.textContent = val.length > 0 ? pwLabels[score] : '';
  if (pwInput) {
    pwInput.classList.remove('pw-weak', 'pw-medium', 'pw-strong');
    if (val.length > 0) pwInput.classList.add('pw-' + cls);
  }
}

function initPwStrength() {
  const pw = document.getElementById('f-password');
  if (pw && pw.value) updatePwStrength(pw.value);
}

function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (el.type === 'password') { el.type = 'text'; btn.textContent = '🙈'; }
  else { el.type = 'password'; btn.textContent = '👁'; }
}

function filterPhoneInput(input) {
  input.value = input.value.replace(/\D/g, '');
}

function showError(fieldId, msg) {
  const err = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (err) {
    err.textContent = msg;
    err.classList.add('visible');
  }
  if (input) input.classList.add('input-error');
}

function clearError(fieldId) {
  const err = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (err) err.classList.remove('visible');
  if (input) input.classList.remove('input-error');
}

function showToast(msg, type = 'error') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const icons = {
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast-popup ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.error}</div>
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  clearTimeout(window._tt);
  window._tt = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

async function doRegister() {
  const first = document.getElementById('f-firstname')?.value.trim();
  const last = document.getElementById('f-lastname')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();
  const pass = document.getElementById('f-password')?.value;
  const pass2 = document.getElementById('f-password2')?.value;

  let hasError = false;

  if (!first) { showError('firstname', t('error_nombre')); hasError = true; }
  if (!last) { showError('lastname', t('error_apellido')); hasError = true; }
  if (!email) { showError('email', t('error_correo')); hasError = true; }
  if (!pass) { showError('password', t('error_contrasena')); hasError = true; }
  else if (pass.length < 8) { showError('password', t('pw_short') || 'Mínimo 8 caracteres'); hasError = true; }
  if (!pass2) { showError('password2', t('error_contrasenas_no_coinciden')); hasError = true; }
  else if (pass !== pass2) { showError('password2', t('error_contrasenas_no_coinciden')); hasError = true; }

  const whatsappInput = document.getElementById('f-whatsapp');
  const whatsappVal = whatsappInput?.value.replace(/\D/g, '') || '';
  if (!whatsappVal || whatsappVal.length < 8) {
    showError('whatsapp', t('error_telefono'));
    hasError = true;
  }

  if (hasError) return;

  if (phoneInstance) {
    state.form.whatsapp = phoneInstance.getNumber();
    state.form.country = phoneInstance.getSelectedCountryData().iso2.toUpperCase();
  }

  const btn = document.getElementById('btnRegister');
  if (btn) { btn.textContent = t('creando_cuenta'); btn.disabled = true; }

  // Check if user already exists
  const existingUser = localStorage.getItem('flash_user');
  if (existingUser) {
    const existing = JSON.parse(existingUser);
    if (existing.email === email) {
      alert('Este email ya está registrado. Usa el login.');
      if (btn) { btn.textContent = t('btn_crear_cuenta'); btn.disabled = false; }
      return;
    }
  }

  try {
    // Store user data in localStorage (simulating backend storage)
    const userData = {
      name: `${first} ${last}`,
      email,
      password: pass,
      whatsapp: phoneInstance ? phoneInstance.getNumber() : '',
      country: state.form.country || 'BJ',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('flash_user', JSON.stringify(userData));
    localStorage.setItem('pending_user_email', email);
    
    // Generate mock OTP for demo
    const mockOTP = '123456';
    localStorage.setItem('pending_otp', mockOTP);
    console.log('[REGISTER] Demo OTP:', mockOTP);
    alert('¡Cuenta creada! Código OTP: 123456 (demo)');
    
    showSuccessModal(email);
  } catch (error) {
    alert(error.message || 'Registration failed');
    if (btn) { btn.textContent = t('btn_crear_cuenta'); btn.disabled = false; }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  state.lang = localStorage.getItem('lang') || 'es';
  document.documentElement.lang = state.lang;
  await loadTranslations(state.lang);
  initDOM();
});
