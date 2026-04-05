import i18next from 'i18next';
import { countries } from 'countries-list';

const API_BASE = 'https://staging.bitcoinflash.xyz/api/v1';

const state = {
  step: 0, totalSteps: 6, userId: null, jwtToken: null,
  lang: 'es',
  form: {
    name: '', email: '', password: '', whatsapp: '',
    country: 'BJ', provider: '', mobileMoneyPhone: '',
    action: 'buy', amount: '5000'
  }
};

async function initI18n() {
  const resources = {
    es: { translation: await fetch('/locales/es/translation.json').then(r => r.json()) },
    fr: { translation: await fetch('/locales/fr/translation.json').then(r => r.json()) },
    en: { translation: await fetch('/locales/en/translation.json').then(r => r.json()) },
    pt: { translation: await fetch('/locales/pt/translation.json').then(r => r.json()) }
  };

  await i18next.init({
    resources,
    lng: state.lang,
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });
}

const t = (key) => i18next.t(key);

/* ══════════════════════════════════════════════
   DATOS ESTÁTICOS
══════════════════════════════════════════════ */
const providers = [
  { id: 'mtn',     name: 'MTN MoMo',   emoji: '🟡', countries: "Bénin, Côte d'Ivoire" },
  { id: 'moov',    name: 'Moov Money', emoji: '🔵', countries: 'Bénin, Togo' },
  { id: 'celtiis', name: 'Celtiis',    emoji: '🟢', countries: 'Bénin' },
  { id: 'togocel', name: 'Togocel',    emoji: '🔴', countries: 'Togo' },
];

const countryCodes = [
  { code: 'BJ', flag: '🇧🇯', dial: '+229' },
  { code: 'TG', flag: '🇹🇬', dial: '+228' },
  { code: 'CI', flag: '🇨🇮', dial: '+225' },
];

const operatorColors = {
  mtn:     { bg: '#FFEB3B', color: '#333' },
  moov:    { bg: '#2196F3', color: '#fff' },
  celtiis: { bg: '#4CAF50', color: '#fff' },
  togocel: { bg: '#F44336', color: '#fff' },
};

const operatorImages = {
  mtn: [
    'https://www.mastercard.com/news/media/zh5euxog/serigne-dioum-group-ceo-mtn-fintech-and-amnah-ajmal-executive-vice-president-market-development-eemea-at-mastercard.jpg',
    'https://eu-images.contentstack.com/v3/assets/blta47798dd33129a0c/bltd2644456b687c90e/68b6d3c547d0e167b4aed181/MTN_Fintech_CEO_Francis_Matseketsa_and_MTN_South_Sudan_CEO_Mapula_Bodibe_(1)_(1).jpg',
    'https://pbs.twimg.com/media/Dm4_sA3WwAA6lyA.jpg'
  ],
  moov: [],
  celtiis: [],
  togocel: [],
};

const operatorLogos = {
  mtn: 'https://i.pinimg.com/236x/f2/f9/38/f2f9385a59cf088b7b77472f3636d4fb.jpg',
};

let currentCarouselIndex = {};

function showOperatorPopup(id) {
  const provider = providers.find(p => p.id === id);
  const colors = operatorColors[id];
  const images = operatorImages[id] || [];
  currentCarouselIndex[id] = 0;
  const popup = document.getElementById('operatorPopup');
  const body = document.getElementById('operatorPopupBody');
  
  let carouselHtml = '';
  if (images.length > 0) {
    carouselHtml = `
      <div class="operator-carousel" id="operatorCarousel">
        <div class="carousel-track" id="carouselTrack">
          ${images.map((img, i) => `<img src="${img}" class="carousel-img ${i === 0 ? 'active' : ''}" alt="${provider.name}" loading="lazy"/>`).join('')}
        </div>
        ${images.length > 1 ? `
          <button class="carousel-btn carousel-prev" onclick="moveCarousel('${id}', -1)">&#8249;</button>
          <button class="carousel-btn carousel-next" onclick="moveCarousel('${id}', 1)">&#8250;</button>
          <div class="carousel-dots">
            ${images.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToCarousel('${id}', ${i})"></span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  const logo = operatorLogos[id];
  const imgContent = logo 
    ? `<img src="${logo}" class="operator-logo" alt="${provider.name}"/>`
    : `<span style="font-size:36px;">${provider.emoji}</span>`;
  
  body.innerHTML = `
    <div class="operator-popup-img" style="${logo ? 'background:none;padding:0;' : `background:${colors.bg};color:${colors.color};`}">
      ${imgContent}
    </div>
    <div class="operator-popup-name">${provider.name}</div>
    <div class="operator-popup-countries">${provider.countries}</div>
    ${carouselHtml}
  `;
  popup.classList.remove('hidden');
}

function moveCarousel(id, direction) {
  const images = operatorImages[id] || [];
  if (images.length === 0) return;
  currentCarouselIndex[id] = (currentCarouselIndex[id] + direction + images.length) % images.length;
  updateCarousel(id);
}

function goToCarousel(id, index) {
  const images = operatorImages[id] || [];
  if (images.length === 0) return;
  currentCarouselIndex[id] = index;
  updateCarousel(id);
}

function updateCarousel(id) {
  const track = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  const imgs = track.querySelectorAll('.carousel-img');
  const idx = currentCarouselIndex[id];
  imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
}

function hideOperatorPopup() {
  document.getElementById('operatorPopup').classList.add('hidden');
}

document.addEventListener('click', e => {
  if (e.target.id === 'operatorPopup') hideOperatorPopup();
});
window.showOperatorPopup = showOperatorPopup;
window.hideOperatorPopup = hideOperatorPopup;
window.moveCarousel = moveCarousel;
window.goToCarousel = goToCarousel;

/* ══════════════════════════════════════════════
   SELECTOR DE IDIOMA
══════════════════════════════════════════════ */
function toggleLang() {
  document.getElementById('langDropdown').classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.header-right')) {
    document.getElementById('langDropdown')?.classList.remove('open');
  }
});

function setLang(code, flag, name, el) {
  state.lang = code;
  i18next.changeLanguage(code);
  localStorage.setItem('i18nextLng', code);
  document.getElementById('langFlag').textContent = flag;
  document.getElementById('langName').textContent = name;
  document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('langDropdown').classList.remove('open');
  renderStep();
}

/* ══════════════════════════════════════════════
   API
══════════════════════════════════════════════ */
async function apiPost(endpoint, body, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && state.jwtToken) headers['Authorization'] = `Bearer ${state.jwtToken}`;
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST', headers, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function showToast(msg, type = 'error') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => { el.className = 'toast hidden'; }, 4000);
}

/* ══════════════════════════════════════════════
   ENHANCED STEPPER COMPONENT
══════════════════════════════════════════════ */
function renderStepper() {
  const steps = [
    { num: 1, label: t('step1_label') || t('step1') },
    { num: 2, label: t('step2_label') || t('step2') },
    { num: 3, label: t('step3_label') || t('step3') },
    { num: 4, label: t('step4_label') || t('step4') }
  ];
  const currentStep = state.step;
  
  return `
    <div class="stepper-container">
      <div class="stepper-track">
        ${steps.map((step, idx) => {
          const isDone = currentStep > step.num;
          const isActive = currentStep === step.num;
          const isUpcoming = currentStep < step.num;
          return `
            <div class="stepper-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isUpcoming ? 'upcoming' : ''}">
              <div class="stepper-circle">
                ${isDone ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : step.num}
              </div>
              <div class="stepper-label">${step.label}</div>
            </div>
            ${idx < steps.length - 1 ? `<div class="stepper-line ${isDone ? 'done' : ''}"></div>` : ''}
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   RENDER PRINCIPAL
══════════════════════════════════════════════ */
function renderStep() {
  document.body.classList.toggle('in-step', state.step > 0);
  const card = document.getElementById('stepCard');
  switch (state.step) {
    case 0: card.innerHTML = renderWelcome();     break;
    case 1: card.innerHTML = renderRegister();    break;
    case 2: card.innerHTML = renderOTP();         break;
    case 3: card.innerHTML = renderWallet();      break;
    case 4: card.innerHTML = renderTransaction(); break;
    case 5: card.innerHTML = renderSuccess();     break;
  }
  if (state.step === 0 || state.step === 1) initPwStrength();
  if (state.step === 2) initOTPInputs();
  updateProgress();
}

/* ══════════════════════════════════════════════
   PASO 0 — WELCOME
══════════════════════════════════════════════ */
function renderWelcome() {
  return `
    <div class="welcome-layout">
      <div class="welcome-left">
          <div class="welcome-logo">
            <img class="logo-icon" src="https://bitcoinflash.xyz/logo.png" alt="Flash"/>
            <span>Flash</span>
          </div>
        <h1>${t('welcome_h1')}</h1>
        <p class="subtitle">${t('welcome_sub')}</p>
        <div class="stats-row">
          <div class="stat-pill"><div class="stat-pill-num">500+</div><div class="stat-pill-label">${t('welcome_users')}</div></div>
          <div class="stat-pill"><div class="stat-pill-num">&lt;5s</div><div class="stat-pill-label">${t('welcome_tx')}</div></div>
          <div class="stat-pill"><div class="stat-pill-num">2%</div><div class="stat-pill-label">${t('welcome_fee')}</div></div>
        </div>
        <div class="providers-label">${t('welcome_works')}</div>
        <div class="providers-row">
          <button class="provider-pill" onclick="showOperatorPopup('mtn')">🟡 MTN MoMo</button>
          <button class="provider-pill" onclick="showOperatorPopup('moov')">🔵 Moov</button>
          <button class="provider-pill" onclick="showOperatorPopup('celtiis')">🟢 Celtiis</button>
          <button class="provider-pill" onclick="showOperatorPopup('togocel')">🔴 Togocel</button>
        </div>
        
      </div>
      <div class="welcome-right">
        <h2>${t('welcome_h2')}</h2>
        <p class="sub">${t('welcome_sub2')}</p>
        ${buildRegisterForm()}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   PASO 1 — REGISTER
══════════════════════════════════════════════ */
function renderRegister() {
  return `
  <div class="card">
    <h2>${t('h2_account')}</h2>
    <p class="subtitle">${t('subtitle_account')}</p>
    ${buildRegisterForm()}
  </div>`;
}

function buildRegisterForm() {
  const ccOptions = countryCodes.map(c =>
    `<option value="${c.code}" ${state.form.country === c.code ? 'selected' : ''}>${c.flag} ${c.dial}</option>`
  ).join('');
  const parts = state.form.name.split(' ');
  const fn = parts[0] || '';
  const ln = parts.slice(1).join(' ') || '';
  return `
    <div class="form-row">
      <div class="form-group">
        <label>${t('label_name')}</label>
        <input id="f-firstname" type="text" placeholder="Kofi" value="${fn}"/>
      </div>
      <div class="form-group">
        <label>${t('label_lastname')}</label>
        <input id="f-lastname" type="text" placeholder="Mensah" value="${ln}"/>
      </div>
    </div>
    <div class="form-group">
      <label>${t('label_email')}</label>
      <input id="f-email" type="email" placeholder="kofi@example.com" value="${state.form.email}"/>
    </div>

   <div class="form-group">
    <label>${t('label_phone')}</label>
      <div class="phone-row">
        <div class="country-selector" id="countrySelector" onclick="toggleCountryDropdown()">
          <span id="selectedFlag">🇧🇯</span>
          <span id="selectedDial">+229</span>
          <span class="selector-arrow" id="selectorArrow">▾</span>
          <div class="country-dropdown" id="countryDropdown">
            <input class="country-search" id="countrySearch" type="text" 
              placeholder="Buscar..." 
              onclick="event.stopPropagation()"
              oninput="filterCountries(this.value)"/>
            <ul class="country-list" id="countryList"></ul>
          </div>
        </div>
        <input id="f-whatsapp" type="tel" placeholder="97 00 00 00" value="${state.form.whatsapp}"/>
      </div>
</div>

    <div class="form-group">
      <label>${t('label_pass')}</label>
      <div class="password-wrap">
        <input id="f-password" type="password" placeholder="${t('pass_placeholder')}" value="${state.form.password}" oninput="updatePwStrength(this.value)"/>
        <button class="toggle-pw" onclick="togglePw('f-password',this)" type="button">👁️</button>
      </div>
      <div class="pw-strength-bar">
        <div class="pw-seg" id="ps1"></div><div class="pw-seg" id="ps2"></div>
        <div class="pw-seg" id="ps3"></div><div class="pw-seg" id="ps4"></div>
      </div>
      <div class="pw-label" id="pwLabel"></div>
    </div>
    <div class="form-group">
      <label>${t('label_pass2')}</label>
      <div class="password-wrap">
        <input id="f-password2" type="password" placeholder="${t('pass2_placeholder')}"/>
        <button class="toggle-pw" onclick="togglePw('f-password2',this)" type="button">👁️</button>
      </div>
    </div>
    <button class="btn btn-primary" id="btnRegister" onclick="doRegister()">${t('btn_register')}</button>
    <div class="trust-row">
      <span class="trust-item">${t('trust1')}</span>
      <span class="trust-item">${t('trust2')}</span>
      <span class="trust-item">${t('trust3')}</span>
    </div>
    <div class="login-link">
      ${t('login_link')} <a onclick="showToast(t('toast_login_soon'),'success')">${t('login_connect')}</a>
    </div>`;
}


// Lista completa de países (generada desde countries-list)
const codeToFlag = (code) => {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join('');
};

const allCountries = Object.entries(countries).map(([code, data]) => ({
  code,
  flag: codeToFlag(code),
  name: data.name,
  dial: '+' + data.phone
}));

function toggleCountryDropdown() {
  const dropdown = document.getElementById('countryDropdown');
  const arrow    = document.getElementById('selectorArrow');
  const isOpen   = dropdown.classList.contains('open');

  if (isOpen) {
    dropdown.classList.remove('open');
    arrow.textContent = '▾';
  } else {
    dropdown.classList.add('open');
    arrow.textContent = '▴';
    renderCountryList(allCountries);
    setTimeout(() => document.getElementById('countrySearch')?.focus(), 50);
  }
}

function renderCountryList(list) {
  const ul = document.getElementById('countryList');
  if (!ul) return;
  ul.innerHTML = list.map(c => `
    <li onclick="selectCountry('${c.code}','${c.flag}','${c.dial}','${c.name}')">
      <span class="cl-flag">${c.flag}</span>
      <span class="cl-name">${c.name}</span>
      <span class="cl-dial">${c.dial}</span>
    </li>
  `).join('');
}

function filterCountries(query) {
  const q = query.toLowerCase();
  const filtered = allCountries.filter(c =>
    c.name.toLowerCase().includes(q) || c.dial.includes(q)
  );
  renderCountryList(filtered);
}

function selectCountry(code, flag, dial, name) {
  state.form.country = code;
  document.getElementById('selectedFlag').textContent = flag;
  document.getElementById('selectedDial').textContent = dial;
  document.getElementById('countryDropdown').classList.remove('open');
  document.getElementById('selectorArrow').textContent = '▾';
  document.getElementById('f-whatsapp')?.focus();
}

// Cerrar al hacer click fuera
document.addEventListener('click', e => {
  if (!e.target.closest('#countrySelector')) {
    document.getElementById('countryDropdown')?.classList.remove('open');
    const arrow = document.getElementById('selectorArrow');
    if (arrow) arrow.textContent = '▾';
  }
  if (!e.target.closest('.header-right')) {
    document.getElementById('langDropdown')?.classList.remove('open');
  }
});/* ══════════════════════════════════════════════
   PASO 2 — OTP
══════════════════════════════════════════════ */
function renderOTP() {
  return `
  <div class="card">
    <h2>${t('h2_otp')}</h2>
    <p class="subtitle">${t('otp_sub')} <strong style="color:var(--text)">${state.form.email}</strong></p>
    <div class="info-box">${t('otp_info')}</div>
    <div class="otp-wrap" id="otpWrap">
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
    </div>
    <button class="btn btn-primary" id="btnVerify" onclick="doVerifyOTP()">${t('btn_verify')}</button>
    <button class="btn btn-secondary" onclick="prevStep()">${t('btn_back_email')}</button>
    <div class="resend-wrap">${t('resend')} <button onclick="doResendOTP()">${t('resend_btn')}</button></div>
  </div>`;
}

/* ══════════════════════════════════════════════
   PASO 3 — WALLET
══════════════════════════════════════════════ */
function renderWallet() {
  const selected = providers.find(p => p.id === state.form.provider);
  return `
  <div class="card">
    <h2>${t('h2_wallet')}</h2>
    <p class="subtitle">${t('wallet_sub')}</p>
    <div class="provider-grid">
      ${providers.map(p => `
        <div class="provider-card ${state.form.provider === p.id ? 'selected' : ''}" onclick="selectProvider('${p.id}')">
          <span class="provider-emoji">${p.emoji}</span>
          <div class="provider-name">${p.name}</div>
          <div class="provider-country">${p.countries}</div>
        </div>`).join('')}
    </div>
    ${selected ? `
      <div class="form-group">
        <label>${selected.name}</label>
        <input id="f-mmPhone" type="tel" placeholder="+229 97 00 00 00" value="${state.form.mobileMoneyPhone}"/>
        <div class="input-hint">✅ ${t('mm_hint')}</div>
      </div>` : ''}
    <button class="btn btn-primary" onclick="validateWallet()">${t('btn_continue')}</button>
    <button class="btn btn-secondary" onclick="prevStep()">${t('btn_back')}</button>
  </div>`;
}

/* ══════════════════════════════════════════════
   PASO 4 — TRANSACCIÓN
══════════════════════════════════════════════ */
function renderTransaction() {
  const isBuy = state.form.action === 'buy';
  const amount = parseInt(state.form.amount) || 5000;
  const rate = 655;
  const sats = Math.floor(amount / rate * 100);
  const fee  = Math.floor(amount * 0.02);
  const total = isBuy ? amount + fee : amount - fee;
  return `
  <div class="card">
    <h2>${t('h2_tx')}</h2>
    <p class="subtitle">${t('tx_sub')}</p>
    <div class="action-tabs">
      <div class="action-tab ${isBuy ? 'active' : ''}" onclick="setAction('buy')">${t('tab_buy')}</div>
      <div class="action-tab ${!isBuy ? 'active' : ''}" onclick="setAction('sell')">${t('tab_sell')}</div>
    </div>
    <div class="form-group">
      <label>${isBuy ? t('pays') : t('sends')} (${isBuy ? 'XOF' : 'SATS'})</label>
      <div class="amount-input-wrap">
        <input id="f-amount" type="number" value="${state.form.amount}"
          oninput="updateAmount(this.value)" placeholder="${isBuy ? '5000' : '1000'}"/>
        <span class="currency-badge">${isBuy ? 'XOF' : 'SATS'}</span>
      </div>
      <div class="input-hint">💡 ${isBuy ? t('min_buy') : t('min_sell')}</div>
    </div>
    <div class="tx-preview">
      <div class="tx-row">
        <span class="tx-label">${isBuy ? t('pays') : t('sends')}</span>
        <span class="tx-value">${isBuy ? amount.toLocaleString() + ' XOF' : amount.toLocaleString() + ' SATS'}</span>
      </div>
      <div class="tx-row">
        <span class="tx-label">${t('rate')}</span>
        <span class="tx-value blue">1 SATS ≈ ${rate} XOF</span>
      </div>
      <div class="tx-row">
        <span class="tx-label">${t('fee')}</span>
        <span class="tx-value">${fee.toLocaleString()} ${isBuy ? 'XOF' : 'SATS'}</span>
      </div>
      <div class="tx-row">
        <span class="tx-label">${t('gets')}</span>
        <span class="tx-value ${isBuy ? 'yellow' : 'green'}">
          ${isBuy ? '~' + sats.toLocaleString() + ' SATS ⚡' : '~' + total.toLocaleString() + ' XOF'}
        </span>
      </div>
    </div>
    <button class="btn btn-primary" onclick="executeTransaction()">
      ${isBuy ? t('btn_buy') : t('btn_sell')}
    </button>
    <button class="btn btn-secondary" onclick="prevStep()">${t('btn_back')}</button>
  </div>`;
}

/* ══════════════════════════════════════════════
   PASO 5 — SUCCESS
══════════════════════════════════════════════ */
function renderSuccess() {
  const phone = (state.form.whatsapp || 'usuario').replace(/\D/g, '').slice(-8);
  return `
  <div class="card" style="max-width:480px;margin:0 auto">
    <div style="text-align:center">
      <div class="success-icon">✓</div>
      <h2 style="text-align:center">${t('success_h2')}</h2>
      <p class="subtitle" style="text-align:center;margin-bottom:18px;">
        <strong style="color:var(--text)">${state.form.name || 'Usuario'}</strong>, ${t('success_sub')}
      </p>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-number">⚡</div><div class="stat-label">Lightning</div></div>
        <div class="stat-box"><div class="stat-number">&lt;5s</div><div class="stat-label">${t('welcome_tx')}</div></div>
        <div class="stat-box"><div class="stat-number">2%</div><div class="stat-label">${t('welcome_fee')}</div></div>
      </div>
      <div class="next-steps">
        <div class="next-step"><span class="next-step-icon">📱</span>${t('next1')}</div>
        <div class="next-step"><span class="next-step-icon">🔄</span>${t('next2')}</div>
        <div class="next-step"><span class="next-step-icon">🔗</span>${t('lightning_addr')}: ${phone}@bitcoinflash.xyz</div>
        <div class="next-step"><span class="next-step-icon">👥</span>${t('next4')}</div>
      </div>
      <button class="btn btn-success" onclick="goToDashboard()">${t('btn_dashboard')}</button>
      <button class="btn btn-secondary" onclick="restart()">${t('btn_restart')}</button>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════
   PASSWORD STRENGTH
══════════════════════════════════════════════ */
function initPwStrength() {
  const pw = document.getElementById('f-password');
  if (pw && pw.value) updatePwStrength(pw.value);
}

function updatePwStrength(val) {
  const segs = [
    document.getElementById('ps1'), document.getElementById('ps2'),
    document.getElementById('ps3'), document.getElementById('ps4')
  ];
  const label = document.getElementById('pwLabel');
  if (!segs[0]) return;
  let score = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const cls    = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const labels = ['', t('pw_weak'), t('pw_medium'), t('pw_strong'), t('pw_vstrong')];
  segs.forEach((s, i) => { s.className = 'pw-seg' + (i < score ? ' ' + cls : ''); });
  if (label) label.textContent = val.length > 0 ? labels[score] : '';
}

/* ══════════════════════════════════════════════
   OTP INPUTS
══════════════════════════════════════════════ */
function initOTPInputs() {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '');
      if (input.value.length === 1) {
        input.classList.add('filled');
        if (i < inputs.length - 1) inputs[i + 1].focus();
        if (i === inputs.length - 1) doVerifyOTP();
      } else {
        input.classList.remove('filled');
      }
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        inputs[i - 1].focus();
        inputs[i - 1].classList.remove('filled');
      }
    });
    input.addEventListener('paste', e => {
      const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (p.length === 6) {
        inputs.forEach((inp, idx) => {
          inp.value = p[idx] || '';
          inp.classList.toggle('filled', !!inp.value);
        });
        e.preventDefault();
        setTimeout(() => doVerifyOTP(), 100);
      }
    });
  });
  inputs[0]?.focus();
}

function getOTPValue() {
  return [...document.querySelectorAll('.otp-input')].map(i => i.value).join('');
}

/* ══════════════════════════════════════════════
   LLAMADAS A LA API
══════════════════════════════════════════════ */
async function doRegister() {
  const first    = document.getElementById('f-firstname')?.value.trim();
  const last     = document.getElementById('f-lastname')?.value.trim();
  const email    = document.getElementById('f-email')?.value.trim();
  const pass     = document.getElementById('f-password')?.value;
  const pass2    = document.getElementById('f-password2')?.value;
  const country  = state.form.country;
  const dialCode = allCountries.find(c => c.code === country)?.dial || '';
  const whatsapp = dialCode + document.getElementById('f-whatsapp')?.value.trim();
   
  if (pass.length < 8)  { showToast(t('toast_pw_short')); return; }
    if (pass !== pass2)   { showToast(t('toast_pw_match')); return; }

  const btn = document.getElementById('btnRegister');
  if (btn) { btn.textContent = t('btn_creating'); btn.disabled = true; }

  // Simulación: guardar datos y avanzar
  state.form = { ...state.form, name: first, email, password: pass, whatsapp, country };
  state.userId = 'demo-user-123';

  await new Promise(r => setTimeout(r, 800)); // pequeño delay para que se sienta real

  showToast(t('toast_created'), 'success');
  state.step = 2;
  renderStep();
}

async function doVerifyOTP() {
  const code = getOTPValue();
  if (code.length < 6) { showToast(t('toast_otp_short')); return; }

  const btn = document.getElementById('btnVerify');
  if (btn) { btn.textContent = t('btn_verifying'); btn.disabled = true; }

  await new Promise(r => setTimeout(r, 800));

  showToast(t('toast_verified'), 'success');
  nextStep();
}

async function doLogin() {
  // No se usa en modo demo
}

async function doResendOTP() {
  await new Promise(r => setTimeout(r, 500));
  showToast(t('toast_resent'), 'success');
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (el.type === 'password') { el.type = 'text';     btn.textContent = '🙈'; }
  else                        { el.type = 'password'; btn.textContent = '👁️'; }
}

function selectProvider(id) { state.form.provider = id; renderStep(); }

function setAction(action) {
  state.form.action = action;
  state.form.amount = action === 'buy' ? '5000' : '1000';
  renderStep();
}

function updateAmount(val) {
  state.form.amount = val;
  const preview = document.querySelector('.tx-preview');
  if (!preview) return;
  const amount = parseInt(val) || 0;
  const isBuy  = state.form.action === 'buy';
  const rate   = 655;
  const sats   = Math.floor(amount / rate * 100);
  const fee    = Math.floor(amount * 0.02);
  const total  = isBuy ? amount + fee : amount - fee;
  const rows   = preview.querySelectorAll('.tx-value');
  if (rows[0]) rows[0].textContent = isBuy ? amount.toLocaleString() + ' XOF' : amount.toLocaleString() + ' SATS';
  if (rows[2]) rows[2].textContent = fee.toLocaleString() + ' ' + (isBuy ? 'XOF' : 'SATS');
  if (rows[3]) rows[3].textContent = isBuy ? '~' + sats.toLocaleString() + ' SATS ⚡' : '~' + total.toLocaleString() + ' XOF';
}

function validateWallet() {
  if (!state.form.provider) { showToast(t('toast_provider')); return; }
  const mmPh = document.getElementById('f-mmPhone')?.value.trim();
  if (!mmPh) { showToast(t('toast_mm_phone')); return; }
  state.form.mobileMoneyPhone = mmPh;
  nextStep();
}

function executeTransaction() {
  const amt = document.getElementById('f-amount')?.value;
  if (amt) state.form.amount = amt;
  showLoading();
  setTimeout(() => { hideLoading(); nextStep(); }, 2000);
}

function goToDashboard() { window.open('https://bitcoinflash.xyz', '_blank'); }

function restart() {
  state.step = 0; state.userId = null; state.jwtToken = null;
  state.form = {
    name: '', email: '', password: '', whatsapp: '',
    country: 'BJ', provider: '', mobileMoneyPhone: '',
    action: 'buy', amount: '5000'
  };
  renderStep();
}

function nextStep() {
  if (state.step < state.totalSteps - 1) { state.step++; renderStep(); }
}

function prevStep() {
  if (state.step > 0) {
    if (state.step === 1) {
      state.form = {
        name: '', email: '', password: '', whatsapp: '',
        country: 'BJ', provider: '', mobileMoneyPhone: '',
        action: 'buy', amount: '5000'
      };
    }
    state.step--; 
    renderStep(); 
  }
}

function showLoading() {
  const o = document.createElement('div');
  o.className = 'loading-overlay';
  o.id = 'loadingOverlay';
  o.innerHTML = `
    <div class="loading-card">
      <div class="spinner"></div>
      <div class="loading-title">${t('loading_title')}</div>
      <div class="loading-sub">${t('loading_sub')}</div>
    </div>`;
  document.querySelector('main').appendChild(o);
}

function hideLoading() {
  document.getElementById('loadingOverlay')?.remove();
}

/* ══════════════════════════════════════════════
   EXPOSE GLOBALS FOR INLINE HANDLERS
   ═════════════════════════════════════════════ */
window.toggleLang     = toggleLang;
window.setLang        = setLang;
window.toggleCountryDropdown = toggleCountryDropdown;
window.filterCountries = filterCountries;
window.selectCountry  = selectCountry;
window.togglePw       = togglePw;
window.updatePwStrength = updatePwStrength;
window.doRegister     = doRegister;
window.doVerifyOTP    = doVerifyOTP;
window.doResendOTP    = doResendOTP;
window.doLogin        = doLogin;
window.selectProvider = selectProvider;
window.setAction      = setAction;
window.updateAmount   = updateAmount;
window.validateWallet = validateWallet;
window.executeTransaction = executeTransaction;
window.goToDashboard  = goToDashboard;
window.restart        = restart;
window.nextStep       = nextStep;
window.prevStep       = prevStep;
window.showToast      = showToast;

/* ══════════════════════════════════════════════
   INIT
   ═════════════════════════════════════════════ */
function initDOM() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="app">
      <div class="progress-wrap" id="progressWrap" style="display:none">
        <div class="progress-header">
          <div class="progress-steps">
            <div class="step-item">
              <div class="step-dot upcoming" id="dot1">1</div>
              <div class="step-label" id="label1">Cuenta</div>
            </div>
            <div class="step-line" id="line1"></div>
            <div class="step-item">
              <div class="step-dot upcoming" id="dot2">2</div>
              <div class="step-label" id="label2">Verificar</div>
            </div>
            <div class="step-line" id="line2"></div>
            <div class="step-item">
              <div class="step-dot upcoming" id="dot3">3</div>
              <div class="step-label" id="label3">Wallet</div>
            </div>
            <div class="step-line" id="line3"></div>
            <div class="step-item">
              <div class="step-dot upcoming" id="dot4">4</div>
              <div class="step-label" id="label4">Transacci&oacute;n</div>
            </div>
          </div>
          <div class="header-right">
            <div class="lang-btn" id="langBtn" onclick="toggleLang()">
              <span id="langFlag">ES</span>
              <span id="langName">Español</span>
              <span>▾</span>
            </div>
            <div class="lang-dropdown" id="langDropdown">
              <div class="lang-option active" onclick="setLang('es','ES','Español',this)">ES Español</div>
              <div class="lang-option" onclick="setLang('fr','FR','Français',this)">FR Français</div>
              <div class="lang-option" onclick="setLang('en','EN','English',this)">EN English</div>
              <div class="lang-option" onclick="setLang('pt','PT','Português',this)">PT Português</div>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div id="stepCard"></div>
      </main>
    </div>
    <div id="toast" class="toast hidden"></div>
  `;
}

function updateProgress() {
  const wrap = document.getElementById('progressWrap');
  wrap.style.display = 'block';
  const step = state.step;
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('dot' + i);
    const line = document.getElementById('line' + i);
    const item = dot ? dot.parentElement : null;
    if (step === 0) {
      dot.className = 'step-dot upcoming';
      if (line) line.className = 'step-line';
      if (item) item.className = 'step-item';
    } else if (i < step) {
      dot.className = 'step-dot done';
      if (line) line.className = 'step-line done';
      if (item) item.className = 'step-item done';
    } else if (i === step) {
      dot.className = 'step-dot active';
      if (line) line.className = 'step-line';
      if (item) item.className = 'step-item active';
    } else {
      dot.className = 'step-dot upcoming';
      if (line) line.className = 'step-line';
      if (item) item.className = 'step-item';
    }
  }
}

initDOM();
initI18n().then(() => { renderStep(); updateProgress(); });