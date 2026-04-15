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
      <div class="card" style="margin: 0 auto; max-width: 480px;">
        <div class="card-body">
          <div class="step-tag">Paso 2 · Tu billetera</div>
          <h2>Registra tu <span>billetera</span></h2>
          <p class="subtitle">Ingresa los datos de tu billetera móvil para recibir pagos.</p>
          
          <div class="form-group">
            <label>Operador</label>
            <select class="country-select" id="provider" style="width: 100%; height: 36px;">
              <option value="mtn">MTN</option>
              <option value="orange">Orange Money</option>
              <option value="wave">Wave</option>
              <option value="moov">Moov</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Número de billetera</label>
            <input type="tel" id="walletPhone" placeholder="6XX XXX XXX" autocomplete="tel"/>
          </div>
          
          <div class="form-group">
            <label>Confirmar número</label>
            <input type="tel" id="walletPhone2" placeholder="Repite el número" autocomplete="tel"/>
          </div>
          
          <button class="btn btn-primary btn-full" id="btnWallet" onclick="doRegisterWallet()">Continuar</button>
          
          <div class="login-link" style="margin-top: 12px;">
            <a href="/html/iniciar-sesion.html">Omitir por ahora</a>
          </div>
        </div>
      </div>
    </main>
  `;
}

function doRegisterWallet() {
  const phone = document.getElementById('walletPhone')?.value.trim();
  const phone2 = document.getElementById('walletPhone2')?.value.trim();
  
  if (phone.length < 8) {
    alert('Ingresa un número válido');
    return;
  }
  if (phone !== phone2) {
    alert('Los números no coinciden');
    return;
  }
  
  const btn = document.getElementById('btnWallet');
  btn.textContent = 'Guardando...';
  btn.disabled = true;
  
  setTimeout(() => {
    window.location.href = '/html/iniciar-sesion.html';
  }, 1000);
}

document.addEventListener('DOMContentLoaded', initDOM);