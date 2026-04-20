const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

const svg = {
  zap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 18l.75 2.25L8 21l-2.25.75L5 24l-.75-2.25L2 21l2.25-.75L5 18zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  eye: '👁',
  eyeOff: '🙈',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

let state = {
  firstname: '', lastname: '', email: '', phone: '',
  password: '', confirmPassword: '',
  errors: {},
  showPassword: false, showConfirmPassword: false,
  isSubmitting: false, isSuccess: false,
  showLangDropdown: false,
  lang: localStorage.getItem('lang') || 'fr'
};

let phoneInstance = null;

function render() {
  const app = document.getElementById('app');
  const currentLang = languages.find(l => l.code === state.lang) || languages[0];

  if (state.isSuccess) {
    app.innerHTML = `
      <div class="success-screen animate-fadeIn">
        <div class="success-icon">${svg.checkCircle}</div>
        <h2>¡Cuenta creada!</h2>
        <p>Revisa tu email para verificar tu cuenta.</p>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <nav>
      <div class="nav-inner">
        <a href="/" class="logo">
          <img src="/flash.png" alt="Flash"/>
          <span>Flash</span>
        </a>
        <div class="nav-right">
          <button class="nav-btn" onclick="window.history.back()">
            ${svg.chevronLeft}
          </button>
          <div style="position:relative">
            <button class="nav-btn" id="langBtn">
              ${svg.globe}
              <span>${currentLang.label}</span>
            </button>
            <div id="langDropdown" class="dropdown ${state.showLangDropdown ? 'open' : ''}" style="display:${state.showLangDropdown ? 'block' : 'none'}">
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
      <div class="card animate-fadeIn">
        <div class="card-grid">
          <div class="card-left">
            <div class="brand">
              <div class="brand-icon">${svg.zap}</div>
              <span>Flash</span>
            </div>
            <h2 class="left-title">L'accès au Bitcoin n'a jamais été aussi simple !</h2>
            <p class="left-subtitle">Achetez puis vendez des Sats en toute sécurité à un prix compétitif.</p>
            
            <img src="/img/log.png" alt="Flash Logo" style="width:180px;margin:20px auto;display:block;" />

            <div class="feature">
              <div class="feature-icon">${svg.shield}</div>
              <span>100% sécurisé et protégé</span>
            </div>
            <div class="feature">
              <div class="feature-icon">${svg.sparkles}</div>
              <span>Transaction instantanée</span>
            </div>
            <div class="feature">
              <div class="feature-icon">${svg.check}</div>
              <span>Sans commission cachée</span>
            </div>
          </div>

          <div class="card-right">
            <div class="stepper">
              <div class="step">
                <div class="step-circle active">1</div>
                <span class="step-label active">Tu cuenta</span>
              </div>
              <div class="step-line"></div>
              <div class="step">
                <div class="step-circle inactive">2</div>
                <span class="step-label inactive">Vérification</span>
              </div>
              <div class="step-line"></div>
              <div class="step">
                <div class="step-circle inactive">3</div>
                <span class="step-label inactive">Acheter</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Nom</label>
                <input type="text" id="firstname" placeholder="Kofi"/>
                <p id="firstname-error" class="error-msg"></p>
              </div>
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" id="lastname" placeholder="Mensah"/>
                <p id="lastname-error" class="error-msg"></p>
              </div>
            </div>

            <div class="form-group">
              <label>Adresse e-mail</label>
              <div class="input-wrap">
                ${svg.mail}
                <input type="email" id="email" placeholder="kofi@example.com"/>
              </div>
              <p id="email-error" class="error-msg"></p>
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" id="phone" class="phone-input"/>
              <p id="phone-error" class="error-msg"></p>
            </div>

            <div class="form-group">
              <label>Mot de passe</label>
              <div class="input-wrap">
                ${svg.lock}
                <input type="${state.showPassword ? 'text' : 'password'}" id="password" placeholder="Min. 8 caractères"/>
                <button type="button" class="pw-toggle" id="pwToggle">
                  ${state.showPassword ? svg.eyeOff : svg.eye}
                </button>
              </div>
              <p id="password-error" class="error-msg"></p>
            </div>

            <div class="form-group">
              <label>Confirmer</label>
              <div class="input-wrap">
                ${svg.lock}
                <input type="${state.showConfirmPassword ? 'text' : 'password'}" id="confirmPassword" placeholder="Répéter le mot de passe"/>
                <button type="button" class="pw-toggle" id="confirmPwToggle">
                  ${state.showConfirmPassword ? svg.eyeOff : svg.eye}
                </button>
              </div>
              <p id="confirmPassword-error" class="error-msg"></p>
            </div>

            <button type="button" class="btn btn-primary btn-full" id="submitBtn">
              Créer mon compte
            </button>

            <p class="text-center text-muted mt-6">
              Vous avez un compte? <a href="/html/iniciar-sesion.html" class="link">Connectez-vous</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  `;

  bindEvents();
  initPhoneInput();
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
    });
  });

  document.getElementById('pwToggle').addEventListener('click', () => {
    state.showPassword = !state.showPassword;
    const input = document.getElementById('password');
    input.type = state.showPassword ? 'text' : 'password';
    document.getElementById('pwToggle').innerHTML = state.showPassword ? svg.eyeOff : svg.eye;
  });

  document.getElementById('confirmPwToggle').addEventListener('click', () => {
    state.showConfirmPassword = !state.showConfirmPassword;
    const input = document.getElementById('confirmPassword');
    input.type = state.showConfirmPassword ? 'text' : 'password';
    document.getElementById('confirmPwToggle').innerHTML = state.showConfirmPassword ? svg.eyeOff : svg.eye;
  });

  document.getElementById('firstname').addEventListener('input', (e) => {
    state.firstname = e.target.value;
    clearError('firstname');
  });

  document.getElementById('lastname').addEventListener('input', (e) => {
    state.lastname = e.target.value;
    clearError('lastname');
  });

  document.getElementById('email').addEventListener('input', (e) => {
    state.email = e.target.value;
    clearError('email');
  });

  document.getElementById('password').addEventListener('input', (e) => {
    state.password = e.target.value;
    clearError('password');
  });

  document.getElementById('confirmPassword').addEventListener('input', (e) => {
    state.confirmPassword = e.target.value;
    clearError('confirmPassword');
  });

  document.getElementById('phone').addEventListener('input', (e) => {
    state.phone = e.target.value;
    clearError('phone');
  });

  document.getElementById('submitBtn').addEventListener('click', handleSubmit);

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
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;

function validateEmail(email) {
  if (typeof email !== 'string') return { valid: false, error: 'Email is required' };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { valid: false, error: 'Email is required' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: 'Invalid email format' };
  if (trimmed.length > 254) return { valid: false, error: 'Email is too long' };
  return { valid: true, value: trimmed };
}

function validatePassword(password) {
  if (typeof password !== 'string') return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (password.length > 128) return { valid: false, error: 'Password is too long' };
  return { valid: true, value: password };
}

function validateName(name) {
  if (typeof name !== 'string') return { valid: false, error: 'Name is required' };
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: 'Name is required' };
  if (trimmed.length < 2) return { valid: false, error: 'Name is too short' };
  if (trimmed.length > 100) return { valid: false, error: 'Name is too long' };
  if (!NAME_REGEX.test(trimmed)) return { valid: false, error: 'Name can only contain letters' };
  return { valid: true, value: trimmed };
}

function validatePhone(phone) {
  if (typeof phone !== 'string') return { valid: false, error: 'Phone is required' };
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(cleaned)) return { valid: false, error: 'Invalid phone number' };
  return { valid: true, value: cleaned };
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

function handleSubmit() {
  const errors = {};
  const firstname = validateName(state.firstname);
  if (!firstname.valid) errors.firstname = firstname.error;
  const lastname = validateName(state.lastname);
  if (!lastname.valid) errors.lastname = lastname.error;
  const email = validateEmail(state.email);
  if (!email.valid) errors.email = email.error;
  let fullPhone = state.phone;
  if (phoneInstance) {
    fullPhone = phoneInstance.getNumber();
  }
  const phone = validatePhone(fullPhone);
  if (!phone.valid) errors.phone = phone.error;
  const password = validatePassword(state.password);
  if (!password.valid) errors.password = password.error;
  if (state.password !== state.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  Object.keys(errors).forEach(field => showError(field, errors[field]));

  if (Object.keys(errors).length > 0) {
    showToast('Llena todos los campos');
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Création en cours...';

  setTimeout(() => {
    state.isSuccess = true;
    render();
  }, 1500);
}

function initPhoneInput() {
  const phoneInput = document.getElementById('phone');
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

render();