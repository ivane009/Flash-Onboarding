// ── Config ───────────────────────────────────────────────────────────────────
const API_BASE = 'https://staging.bitcoinflash.xyz/api/v1';

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  step: 0,
  totalSteps: 6, // 0:Welcome 1:Register 2:OTP 3:Wallet 4:Transaction 5:Success
  userId: null,
  jwtToken: null,
  form: {
    name: '', email: '', password: '', whatsapp: '', country: '',
    provider: '', mobileMoneyPhone: '',
    action: 'buy', amount: '5000',
  }
};

const stepLabels = ['Bienvenida', 'Cuenta', 'Verificar Email', 'Wallet', 'Transacción', '¡Listo!'];

const providers = [
  { id: 'mtn',     name: 'MTN MoMo',   emoji: '🟡', countries: "Benín, Côte d'Ivoire" },
  { id: 'moov',    name: 'Moov Money', emoji: '🔵', countries: 'Benín, Togo' },
  { id: 'celtiis', name: 'Celtiis',    emoji: '🟢', countries: 'Benín' },
  { id: 'togocel', name: 'Togocel',    emoji: '🔴', countries: 'Togo' },
];

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiPost(endpoint, body, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && state.jwtToken) {
    headers['Authorization'] = `Bearer ${state.jwtToken}`;
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'error') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { toast.className = 'toast hidden'; }, 4000);
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function renderProgress() {
  const wrap = document.getElementById('progressWrap');
  if (state.step === 0 || state.step === 5) { wrap.innerHTML = ''; return; }

  let html = '<div class="progress-steps">';
  for (let i = 1; i < state.totalSteps - 1; i++) {
    const cls = i < state.step ? 'done' : i === state.step ? 'active' : 'upcoming';
    html += `<div class="step-dot ${cls}">${i < state.step ? '✓' : i}</div>`;
    if (i < state.totalSteps - 2) {
      html += `<div class="step-line ${i < state.step ? 'done' : ''}"></div>`;
    }
  }
  html += '</div>';
  html += `<div class="progress-label">${stepLabels[state.step]} — Paso ${state.step} de ${state.totalSteps - 2}</div>`;
  wrap.innerHTML = html;
}

// ── Step router ───────────────────────────────────────────────────────────────
function renderStep() {
  renderProgress();
  const card = document.getElementById('stepCard');
  switch (state.step) {
    case 0: card.innerHTML = renderWelcome();     break;
    case 1: card.innerHTML = renderRegister();    break;
    case 2: card.innerHTML = renderOTP();         break;
    case 3: card.innerHTML = renderWallet();      break;
    case 4: card.innerHTML = renderTransaction(); break;
    case 5: card.innerHTML = renderSuccess();     break;
  }
  card.style.animation = 'none';
  requestAnimationFrame(() => { card.style.animation = 'fadeSlideIn 0.4s ease'; });
  if (state.step === 2) initOTPInputs();
}

// ── Step 0 · Welcome ──────────────────────────────────────────────────────────
function renderWelcome() {
  return `
    <div class="step-tag">⚡ Plataforma Bitcoin</div>
    <h1>Bitcoin para <span>todos</span> en África Occidental</h1>
    <p class="subtitle">Compra y vende Bitcoin en segundos usando tu billetera móvil. Sin cuenta bancaria, sin complicaciones.</p>
    <div class="props">
      <div class="prop"><div class="prop-icon">📱</div><div class="prop-text"><strong>Usa tu móvil money</strong>MTN MoMo, Moov Money, Celtiis, Togocel</div></div>
      <div class="prop"><div class="prop-icon">⚡</div><div class="prop-text"><strong>Transacciones instantáneas</strong>Bitcoin en segundos via Lightning Network</div></div>
      <div class="prop"><div class="prop-icon">💰</div><div class="prop-text"><strong>Desde 100 XOF</strong>Sin mínimos exagerados, empieza cuando quieras</div></div>
      <div class="prop"><div class="prop-icon">🌍</div><div class="prop-text"><strong>Benín · Togo · Côte d'Ivoire</strong>Diseñado para África Occidental Francófona</div></div>
    </div>
    <button class="btn btn-primary" onclick="nextStep()">Empezar ahora →</button>
  `;
}

// ── Step 1 · Register ─────────────────────────────────────────────────────────
function renderRegister() {
  return `
    <div class="step-tag">Paso 1 · Tu cuenta</div>
    <h2>Crea tu <span>cuenta</span></h2>
    <p class="subtitle">Recibirás un código de verificación en tu email.</p>
    <div class="form-group">
      <label>Nombre completo</label>
      <input id="f-name" type="text" placeholder="Kofi Mensah" value="${state.form.name}"/>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input id="f-email" type="email" placeholder="kofi@example.com" value="${state.form.email}"/>
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <div class="password-wrap">
        <input id="f-password" type="password" placeholder="Mínimo 8 caracteres" value="${state.form.password}"/>
        <button class="toggle-pw" onclick="togglePw('f-password',this)" type="button">👁️</button>
      </div>
    </div>
    <div class="form-group">
      <label>Confirmar contraseña</label>
      <div class="password-wrap">
        <input id="f-password2" type="password" placeholder="Repite tu contraseña"/>
        <button class="toggle-pw" onclick="togglePw('f-password2',this)" type="button">👁️</button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>País</label>
        <select id="f-country">
          <option value="" ${!state.form.country?'selected':''}>Selecciona</option>
          <option value="BJ" ${state.form.country==='BJ'?'selected':''}>🇧🇯 Benín</option>
          <option value="TG" ${state.form.country==='TG'?'selected':''}>🇹🇬 Togo</option>
          <option value="CI" ${state.form.country==='CI'?'selected':''}>🇨🇮 Côte d'Ivoire</option>
        </select>
      </div>
      <div class="form-group">
        <label>WhatsApp</label>
        <input id="f-whatsapp" type="tel" placeholder="+22997000000" value="${state.form.whatsapp}"/>
      </div>
    </div>
    <button class="btn btn-primary" id="btnRegister" onclick="doRegister()">Crear cuenta →</button>
    <button class="btn btn-secondary" onclick="prevStep()">← Volver</button>
  `;
}

// ── Step 2 · OTP ──────────────────────────────────────────────────────────────
function renderOTP() {
  return `
    <div class="step-tag">Paso 2 · Verificar Email</div>
    <h2>Revisa tu <span>email</span></h2>
    <p class="subtitle">Enviamos un código de 6 dígitos a <strong style="color:var(--text)">${state.form.email}</strong></p>
    <div class="info-box">
      📩 Revisa tu bandeja de entrada y carpeta de spam.<br/>
      <strong>El código expira en 10 minutos.</strong>
    </div>
    <div class="otp-wrap" id="otpWrap">
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
      <input class="otp-input" maxlength="1" type="text" inputmode="numeric" pattern="[0-9]"/>
    </div>
    <button class="btn btn-primary" id="btnVerify" onclick="doVerifyOTP()">Verificar código →</button>
    <button class="btn btn-secondary" onclick="prevStep()">← Cambiar email</button>
    <div class="resend-wrap">¿No recibiste el código? <button onclick="doResendOTP()">Reenviar código</button></div>
  `;
}

// ── Step 3 · Wallet ───────────────────────────────────────────────────────────
function renderWallet() {
  return `
    <div class="step-tag">Paso 3 · Tu wallet</div>
    <h2>Conecta tu <span>Mobile Money</span></h2>
    <p class="subtitle">Elige tu proveedor para recibir y enviar dinero fiat automáticamente.</p>
    <div class="provider-grid">
      ${providers.map(p => `
        <div class="provider-card ${state.form.provider===p.id?'selected':''}" onclick="selectProvider('${p.id}')">
          <span class="provider-emoji">${p.emoji}</span>
          <div class="provider-name">${p.name}</div>
          <div class="provider-country">${p.countries}</div>
        </div>
      `).join('')}
    </div>
    ${state.form.provider ? `
      <div class="form-group">
        <label>Número de ${providers.find(p=>p.id===state.form.provider)?.name}</label>
        <input id="f-mmPhone" type="tel" placeholder="+229 97 00 00 00" value="${state.form.mobileMoneyPhone}"/>
        <div class="input-hint">✅ Este número recibirá tu fiat al vender Bitcoin</div>
      </div>
    ` : ''}
    <button class="btn btn-primary" onclick="validateWallet()">Continuar →</button>
    <button class="btn btn-secondary" onclick="prevStep()">← Volver</button>
  `;
}

// ── Step 4 · Transaction ──────────────────────────────────────────────────────
function renderTransaction() {
  const isBuy  = state.form.action === 'buy';
  const amount = parseInt(state.form.amount) || 5000;
  const rate   = 655;
  const sats   = Math.floor(amount / rate * 100);
  const fee    = Math.floor(amount * 0.02);
  const total  = isBuy ? amount + fee : amount - fee;
  return `
    <div class="step-tag">Paso 4 · Primera transacción</div>
    <h2>Tu primera <span>transacción</span></h2>
    <p class="subtitle">Prueba comprando o vendiendo una pequeña cantidad.</p>
    <div class="action-tabs">
      <div class="action-tab ${isBuy?'active':''}" onclick="setAction('buy')">⬇️ Comprar BTC</div>
      <div class="action-tab ${!isBuy?'active':''}" onclick="setAction('sell')">⬆️ Vender BTC</div>
    </div>
    <div class="form-group">
      <label>${isBuy?'Cantidad a pagar (XOF)':'Satoshis a vender'}</label>
      <div class="amount-input-wrap">
        <input id="f-amount" type="number" value="${state.form.amount}" oninput="updateAmount(this.value)" placeholder="${isBuy?'5000':'1000'}"/>
        <span class="currency-badge">${isBuy?'XOF':'SATS'}</span>
      </div>
      <div class="input-hint">💡 Mínimo: ${isBuy?'100 XOF':'200 SATS'}</div>
    </div>
    <div class="tx-preview">
      <div class="tx-row"><span class="tx-label">${isBuy?'Pagas':'Envías'}</span><span class="tx-value">${isBuy?amount.toLocaleString()+' XOF':amount.toLocaleString()+' SATS'}</span></div>
      <div class="tx-row"><span class="tx-label">Tasa actual</span><span class="tx-value blue">1 SATS ≈ ${rate} XOF</span></div>
      <div class="tx-row"><span class="tx-label">Comisión (2%)</span><span class="tx-value">${fee.toLocaleString()} ${isBuy?'XOF':'SATS'}</span></div>
      <div class="tx-row"><span class="tx-label">Recibes</span><span class="tx-value ${isBuy?'yellow':'green'}">${isBuy?'~'+sats.toLocaleString()+' SATS ⚡':'~'+total.toLocaleString()+' XOF'}</span></div>
    </div>
    <button class="btn btn-primary" onclick="executeTransaction()">${isBuy?'⚡ Comprar Bitcoin':'💰 Vender Bitcoin'}</button>
    <button class="btn btn-secondary" onclick="prevStep()">← Volver</button>
  `;
}

// ── Step 5 · Success ──────────────────────────────────────────────────────────
function renderSuccess() {
  const phone = (state.form.whatsapp||'usuario').replace(/\D/g,'').slice(-8);
  return `
    <div style="text-align:center">
      <div class="success-icon">✓</div>
      <h2 style="text-align:center">¡Bienvenido a <span>Flash</span>!</h2>
      <p class="subtitle" style="text-align:center;margin-bottom:24px;">
        Hola <strong style="color:var(--text)">${state.form.name||'Usuario'}</strong>, tu cuenta está activa. 🌍
      </p>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-number">⚡</div><div class="stat-label">Lightning<br>Network</div></div>
        <div class="stat-box"><div class="stat-number">&lt;5s</div><div class="stat-label">Tiempo de<br>transacción</div></div>
        <div class="stat-box"><div class="stat-number">2%</div><div class="stat-label">Comisión<br>total</div></div>
      </div>
      <div class="next-steps">
        <div class="next-step"><span class="next-step-icon">📱</span>Descarga la app móvil para gestionar tu wallet</div>
        <div class="next-step"><span class="next-step-icon">🔄</span>Configura auto-conversión de BTC a fiat</div>
        <div class="next-step"><span class="next-step-icon">🔗</span>Tu Lightning Address: ${phone}@bitcoinflash.xyz</div>
        <div class="next-step"><span class="next-step-icon">👥</span>Invita a amigos y gana comisiones</div>
      </div>
      <button class="btn btn-success" onclick="goToDashboard()">Ir a mi dashboard →</button>
      <button class="btn btn-secondary" onclick="restart()" style="margin-top:8px">Reiniciar</button>
    </div>
  `;
}

// ── OTP inputs ────────────────────────────────────────────────────────────────
function initOTPInputs() {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '');
      if (input.value.length === 1) {
        input.classList.add('filled');
        if (i < inputs.length - 1) inputs[i+1].focus();
        if (i === inputs.length - 1) doVerifyOTP();
      } else {
        input.classList.remove('filled');
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && i > 0) {
        inputs[i-1].focus();
        inputs[i-1].classList.remove('filled');
      }
    });
    input.addEventListener('paste', (e) => {
      const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
      if (pasted.length === 6) {
        inputs.forEach((inp, idx) => { inp.value = pasted[idx]||''; inp.classList.toggle('filled', !!inp.value); });
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

// ── API calls ─────────────────────────────────────────────────────────────────
async function doRegister() {
  const name     = document.getElementById('f-name')?.value.trim();
  const email    = document.getElementById('f-email')?.value.trim();
  const pass     = document.getElementById('f-password')?.value;
  const pass2    = document.getElementById('f-password2')?.value;
  const country  = document.getElementById('f-country')?.value;
  const whatsapp = document.getElementById('f-whatsapp')?.value.trim();

  if (!name||!email||!pass||!pass2||!country||!whatsapp) { showToast('Por favor completa todos los campos.'); return; }
  if (pass.length < 8) { showToast('La contraseña debe tener al menos 8 caracteres.'); return; }
  if (pass !== pass2)  { showToast('Las contraseñas no coinciden.'); return; }

  const btn = document.getElementById('btnRegister');
  btn.textContent = 'Creando cuenta...'; btn.disabled = true;

  try {
    const res = await apiPost('/auth/register', {
      name, email, password: pass, password_confirmation: pass2, whatsapp, country,
    });
    state.form = { ...state.form, name, email, password: pass, whatsapp, country };
    state.userId = res.data?.user?.id;
    showToast('¡Cuenta creada! Revisa tu email.', 'success');
    nextStep();
  } catch (err) {
    const errors = err.data?.errors;
    const msg = errors ? Object.values(errors)[0]?.[0] : (err.data?.message || 'Error al registrar.');
    showToast(msg);
    btn.textContent = 'Crear cuenta →'; btn.disabled = false;
  }
}

async function doVerifyOTP() {
  const code = getOTPValue();
  if (code.length < 6) { showToast('Ingresa el código completo de 6 dígitos.'); return; }
  if (!state.userId)   { showToast('Error: no se encontró el ID de usuario.'); return; }

  const btn = document.getElementById('btnVerify');
  if (btn) { btn.textContent = 'Verificando...'; btn.disabled = true; }

  try {
    await apiPost('/auth/verify-otp', { user_id: state.userId, code });
    await doLogin();
  } catch (err) {
    showToast(err.data?.message || 'Código incorrecto o expirado.');
    if (btn) { btn.textContent = 'Verificar código →'; btn.disabled = false; }
  }
}

async function doLogin() {
  try {
    const res = await apiPost('/auth/login', { email: state.form.email, password: state.form.password });
    state.jwtToken = res.data?.token;
    showToast('¡Email verificado! Bienvenido.', 'success');
    nextStep();
  } catch (err) {
    showToast(err.data?.message || 'Error al iniciar sesión automáticamente.');
  }
}

async function doResendOTP() {
  if (!state.userId) { showToast('No se encontró el ID de usuario.'); return; }
  try {
    await apiPost('/auth/regenerate-otp', { user_id: state.userId });
    showToast('Código reenviado. Revisa tu email.', 'success');
  } catch (err) {
    showToast('Error al reenviar el código.');
  }
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁️'; }
}
function selectProvider(id) { state.form.provider = id; renderStep(); }
function setAction(action) { state.form.action = action; state.form.amount = action==='buy'?'5000':'1000'; renderStep(); }
function updateAmount(val) {
  state.form.amount = val;
  const preview = document.querySelector('.tx-preview');
  if (!preview) return;
  const amount = parseInt(val)||0, isBuy = state.form.action==='buy', rate=655;
  const sats=Math.floor(amount/rate*100), fee=Math.floor(amount*0.02), total=isBuy?amount+fee:amount-fee;
  const rows = preview.querySelectorAll('.tx-value');
  if (rows[0]) rows[0].textContent = isBuy?amount.toLocaleString()+' XOF':amount.toLocaleString()+' SATS';
  if (rows[2]) rows[2].textContent = fee.toLocaleString()+' '+(isBuy?'XOF':'SATS');
  if (rows[3]) rows[3].textContent = isBuy?'~'+sats.toLocaleString()+' SATS ⚡':'~'+total.toLocaleString()+' XOF';
}
function validateWallet() {
  if (!state.form.provider) { showToast('Selecciona un proveedor de Mobile Money.'); return; }
  const mmPh = document.getElementById('f-mmPhone')?.value.trim();
  if (!mmPh) { showToast('Ingresa tu número de Mobile Money.'); return; }
  state.form.mobileMoneyPhone = mmPh;
  nextStep();
}
function executeTransaction() {
  const amt = document.getElementById('f-amount')?.value;
  if (amt) state.form.amount = amt;
  showLoading();
  setTimeout(() => { hideLoading(); nextStep(); }, 2500);
}
function goToDashboard() { window.open('https://bitcoinflash.xyz', '_blank'); }
function restart() {
  state.step=0; state.userId=null; state.jwtToken=null;
  state.form={ name:'',email:'',password:'',whatsapp:'',country:'',provider:'',mobileMoneyPhone:'',action:'buy',amount:'5000' };
  renderStep();
}
function nextStep() { if(state.step<state.totalSteps-1){state.step++;renderStep();window.scrollTo({top:0,behavior:'smooth'});} }
function prevStep() { if(state.step>0){state.step--;renderStep();window.scrollTo({top:0,behavior:'smooth'});} }
function showLoading() {
  const o=document.createElement('div'); o.className='loading-overlay'; o.id='loadingOverlay';
  o.innerHTML='<div class="loading-card"><div class="spinner"></div><div class="loading-title">Procesando ⚡</div><div class="loading-sub">Enviando via Lightning Network...</div></div>';
  document.body.appendChild(o);
}
function hideLoading() { document.getElementById('loadingOverlay')?.remove(); }

// Init
renderStep();