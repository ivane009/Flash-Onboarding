function initDOM() {
  const root = document.getElementById('app');
  root.innerHTML = `
    <div class="top-bar">
      <div class="top-bar-left">
        <a href="/" class="nav-logo">
          <img class="nav-logo-icon" src="/flash.png" alt="Flash">
          <span class="nav-logo-text">Flash</span>
        </a>
        <a href="/html/crear-cuenta.html" class="back-btn">← Volver</a>
      </div>
    </div>
    <main>
      <div class="card" style="margin: 0 auto; max-width: 520px;">
        <div class="card-body">
          <div class="step-tag">Verificación</div>
          <h2>Confirma tu <span>email</span></h2>
          <p class="subtitle">Ingresa el código de 6 dígitos que enviamos a tu correo.</p>
          <div class="code-inputs">
            <input type="text" maxlength="1" class="code-digit" id="code1" autofocus>
            <input type="text" maxlength="1" class="code-digit" id="code2">
            <input type="text" maxlength="1" class="code-digit" id="code3">
            <input type="text" maxlength="1" class="code-digit" id="code4">
            <input type="text" maxlength="1" class="code-digit" id="code5">
            <input type="text" maxlength="1" class="code-digit" id="code6">
          </div>
          <p class="resend-text">¿No recibiste el código? <a href="#" id="resendBtn">Reenviar</a></p>
          <button class="btn btn-primary btn-full" id="btnVerify" onclick="doVerify()">Verificar</button>
        </div>
      </div>
    </main>
  `;
  initCodeInputs();
}

function initCodeInputs() {
  const inputs = document.querySelectorAll('.code-digit');
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      checkAllFilled();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
}

function checkAllFilled() {
  const code = [1,2,3,4,5,6].map(i => document.getElementById('code' + i)?.value).join('');
  if (code.length === 6) {
    doVerify();
  }
}

async function doVerify() {
  const code = [1,2,3,4,5,6].map(i => document.getElementById('code' + i)?.value).join('');
  if (code.length !== 6) {
    alert('Ingresa el código completo');
    return;
  }
  
  const email = localStorage.getItem('pending_user_email');
  if (!email) {
    alert('Sesión expirada. Por favor regístrate de nuevo.');
    window.location.href = '/html/crear-cuenta.html';
    return;
  }
  
  const storedOTP = localStorage.getItem('pending_otp') || '123456';
  
  const btn = document.getElementById('btnVerify');
  btn.textContent = 'Verificando...';
  btn.disabled = true;
  
  // Simulate verification delay
  await new Promise(r => setTimeout(r, 800));
  
  if (code === storedOTP) {
    // Mark user as verified
    const userStr = localStorage.getItem('flash_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.verified = true;
      localStorage.setItem('flash_user', JSON.stringify(user));
    }
    localStorage.removeItem('pending_user_email');
    localStorage.removeItem('pending_otp');
    alert('¡Email verificado exitosamente!');
    window.location.href = '/html/iniciar-sesion.html';
  } else {
    alert('Código inválido. Intenta de nuevo.');
    btn.textContent = 'Verificar';
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', initDOM);

document.addEventListener('DOMContentLoaded', () => {
  const resendBtn = document.getElementById('resendBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const otp = localStorage.getItem('pending_otp') || '123456';
      alert('Código reenviado. (Para demo: ' + otp + ')');
      console.log('[OTP] Demo code:', otp);
    });
  }
});