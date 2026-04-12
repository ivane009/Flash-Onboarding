const state = {
  form: {
    name: '', email: '', password: '', whatsapp: '',
    country: 'BJ', provider: '', mobileMoneyPhone: '',
    action: 'buy', amount: '5000'
  }
};

function initDOM() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="top-bar">
      <div class="top-bar-logo">
        <div class="logo-icon">⚡</div>
        <span>Flash</span>
      </div>
    </div>
    <main>
      <div id="stepCard">
        <div class="card">
          ${renderCrearCuentaForm()}
        </div>
      </div>
    </main>
    <div id="toast" class="toast hidden"></div>
  `;
  initPwStrength();
}

function renderCrearCuentaForm() {
  return `
    <div class="step-tag">Paso 1 · Tu cuenta</div>
    <h2>Crea tu <span>cuenta</span></h2>
    <p class="subtitle">Recibirás un código de verificación en tu email.</p>
    <div class="form-row">
      <div class="form-group">
        <label>Nombre</label>
        <input id="f-firstname" type="text" placeholder="Kofi"/>
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input id="f-lastname" type="text" placeholder="Mensah"/>
      </div>
    </div>
    <div class="form-group">
      <label>Dirección de correo electrónico</label>
      <input id="f-email" type="email" placeholder="kofi@example.com"/>
    </div>
    <div class="form-group">
      <label>Número de teléfono</label>
      <div class="phone-row">
        <div class="country-selector">
          <span>🇧🇯</span>
          <span>+229</span>
          <span class="selector-arrow">▾</span>
        </div>
        <input id="f-whatsapp" type="tel" placeholder="97 00 00 00"/>
      </div>
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <div class="password-wrap">
        <input id="f-password" type="password" placeholder="Mínimo 8 caracteres" oninput="updatePwStrength(this.value)"/>
        <button class="toggle-pw" onclick="togglePw('f-password',this)" type="button">👁️</button>
      </div>
      <div class="pw-strength-bar">
        <div class="pw-seg" id="ps1"></div>
        <div class="pw-seg" id="ps2"></div>
        <div class="pw-seg" id="ps3"></div>
        <div class="pw-seg" id="ps4"></div>
      </div>
      <div class="pw-label" id="pwLabel"></div>
    </div>
    <div class="form-group">
      <label>Confirmar contraseña</label>
      <div class="password-wrap">
        <input id="f-password2" type="password" placeholder="Repite tu contraseña"/>
        <button class="toggle-pw" onclick="togglePw('f-password2',this)" type="button">👁️</button>
      </div>
    </div>
    <button class="btn btn-primary" id="btnRegister" onclick="doRegister()">⚡ Crear mi cuenta</button>
    <div class="trust-row">
      <span class="trust-item">🔒 100% seguro</span>
      <span class="trust-item">✅ Sin comisión de registro</span>
      <span class="trust-item">⚡ Gratis</span>
    </div>
    <div class="login-link">
      ¿Ya tienes cuenta? <a href="/html/iniciar-sesion.html">¡Conéctate!</a>
    </div>
  `;
}

function updatePwStrength(val) {
  const segs = [
    document.getElementById('ps1'), document.getElementById('ps2'),
    document.getElementById('ps3'), document.getElementById('ps4')
  ];
  const label = document.getElementById('pwLabel');
  if (!segs[0]) return;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
  const labels = ['', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
  segs.forEach((s, i) => { s.className = 'pw-seg' + (i < score ? ' ' + cls : ''); });
  if (label) label.textContent = val.length > 0 ? labels[score] : '';
}

function initPwStrength() {
  const pw = document.getElementById('f-password');
  if (pw && pw.value) updatePwStrength(pw.value);
}

function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (el.type === 'password') { el.type = 'text'; btn.textContent = '🙈'; }
  else { el.type = 'password'; btn.textContent = '👁️'; }
}

function showToast(msg, type = 'error') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => { el.className = 'toast hidden'; }, 4000);
}

function doRegister() {
  const first = document.getElementById('f-firstname')?.value.trim();
  const last = document.getElementById('f-lastname')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();
  const pass = document.getElementById('f-password')?.value;
  const pass2 = document.getElementById('f-password2')?.value;

  if (pass.length < 8) { showToast('La contraseña debe tener al menos 8 caracteres.'); return; }
  if (pass !== pass2) { showToast('Las contraseñas no coinciden.'); return; }

  const btn = document.getElementById('btnRegister');
  if (btn) { btn.textContent = 'Creando cuenta...'; btn.disabled = true; }

  setTimeout(() => {
    showToast('¡Cuenta creada! Revisa tu email.', 'success');
    setTimeout(() => {
      window.location.href = '/html/iniciar-sesion.html';
    }, 1500);
  }, 800);
}

document.addEventListener('DOMContentLoaded', initDOM);