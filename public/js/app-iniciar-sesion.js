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
          ${renderLoginForm()}
        </div>
      </div>
    </main>
    <div id="toast" class="toast hidden"></div>
  `;
}

function renderLoginForm() {
  return `
    <div class="step-tag">Bienvenido</div>
    <h2>Iniciar <span>sesión</span></h2>
    <p class="subtitle">Ingresa tus datos para continuar</p>
    <div class="form-group">
      <label>Dirección de correo electrónico</label>
      <input id="f-email" type="email" placeholder="kofi@example.com"/>
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <div class="password-wrap">
        <input id="f-password" type="password" placeholder="Mínimo 8 caracteres"/>
        <button class="toggle-pw" onclick="togglePw('f-password',this)" type="button">👁️</button>
      </div>
    </div>
    <button class="btn btn-primary" id="btnLogin" onclick="doLogin()">⚡ Iniciar sesión</button>
    <div class="trust-row">
      <span class="trust-item">🔒 Seguro y cifrado</span>
      <span class="trust-item">⚡ Lightning Network</span>
    </div>
    <div class="login-link">
      ¿No tienes cuenta? <a href="/html/crear-cuenta.html">Crear cuenta</a>
    </div>
  `;
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

function doLogin() {
  const email = document.getElementById('f-email')?.value.trim();
  const pass = document.getElementById('f-password')?.value;

  if (!email) { showToast('Email requerido'); return; }
  if (!pass) { showToast('Contraseña requerida'); return; }

  const btn = document.getElementById('btnLogin');
  if (btn) { btn.textContent = 'Iniciando sesión...'; btn.disabled = true; }

  setTimeout(() => {
    showToast('Sesión iniciada', 'success');
    setTimeout(() => {
      window.location.href = '/html/landing.html';
    }, 1500);
  }, 800);
}

document.addEventListener('DOMContentLoaded', initDOM);