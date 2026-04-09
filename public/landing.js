const BTC_PRICE = 83200;
let translations = {};

function calcBtc() {
  const usdInput = document.getElementById('usd-in');
  if (!usdInput) return;
  const usd = parseFloat(usdInput.value) || 0;
  const fee = usd * 0.015;
  const net = usd - fee;
  const btc = net / BTC_PRICE;
  document.getElementById('btc-out').textContent = btc.toFixed(8) + ' BTC';
}

function setTab(el, mode) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const amountLabel = document.querySelector('.calc-label');
  if (amountLabel) {
    amountLabel.textContent = mode === 'comprar' ? t('calc_amount') : t('calc_amount').replace('USD', 'BTC');
  }
}

function toggleFaq(el) {
  const ans = el.nextElementSibling;
  const icon = el.querySelector('.faq-icon');
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));
  if (!isOpen) { ans.classList.add('open'); icon.classList.add('open'); }
}

async function fetchMempoolData() {
  try {
    const [pricesRes, blockRes, feesRes] = await Promise.all([
      fetch('https://mempool.space/api/v1/prices'),
      fetch('https://mempool.space/api/blocks/tip/height'),
      fetch('https://mempool.space/api/v1/fees/recommended')
    ]);

    const prices = await pricesRes.json();
    const blockHeight = await blockRes.text();
    const fees = await feesRes.json();

    // Update ticker
    document.getElementById('btc-usd').textContent = '$' + prices.USD.toLocaleString();
    document.getElementById('btc-eur').textContent = '€' + prices.EUR.toLocaleString();
    document.getElementById('btc-block').textContent = '#' + parseInt(blockHeight).toLocaleString();
    document.getElementById('btc-fees').textContent = fees.fastestFee + ' sat/vB';

    // Update widget prices
    const widgetBtcUsd = document.querySelector('.btc-usd');
    const widgetBtcXof = document.querySelector('.btc-xof');
    if (widgetBtcUsd) widgetBtcUsd.textContent = `BTC: $${prices.USD.toLocaleString()}`;
    if (widgetBtcXof) widgetBtcXof.textContent = `XOF: ${(prices.USD * 655).toLocaleString()}`;

    // Save prices for transaction calculations
    currentPrice.usd = prices.USD;
    currentPrice.xof = prices.USD * 655;
  } catch (error) {
    console.error('Error fetching mempool data:', error);
  }
}

function startAuth(tab) {
  sessionStorage.setItem('authTab', tab);
  sessionStorage.setItem('showAuth', 'true');
  window.location.href = '/';
}

function t(key) {
  return translations[key] || key;
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
  document.title = t('page_title') || 'Flash — Bitcoin';
}

function applyTranslationsToElement(el) {
  el.querySelectorAll('[data-i18n]').forEach(child => {
    const key = child.getAttribute('data-i18n');
    if (child.tagName === 'INPUT' || child.tagName === 'TEXTAREA') {
      child.placeholder = t(key);
    } else {
      child.innerHTML = t(key);
    }
  });
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

async function setLang(lang) {
  sessionStorage.setItem('lang', lang);
  await loadTranslations(lang);
  updateLangLabel(lang);
}

function updateLangLabel(lang) {
  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const savedLang = sessionStorage.getItem('lang') || 'fr';
  const langSelect = document.querySelector('.lang-select');
  if (langSelect) {
    langSelect.value = savedLang;
  }
  updateLangLabel(savedLang);
  await loadTranslations(savedLang);
  calcBtc();
  fetchMempoolData();
  setInterval(fetchMempoolData, 60000);
  initStepTooltips();
  initFeatTooltips();
});

function initStepTooltips() {
  const tooltip = document.getElementById('stepTooltip');
  const tooltipContent = document.getElementById('tooltipContent');
  if (!tooltip || !tooltipContent) return;

  document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const tooltipId = item.dataset.tooltip;
      const template = document.getElementById('tooltip-' + tooltipId);
      if (template) {
        tooltipContent.innerHTML = template.innerHTML;
        applyTranslationsToElement(tooltipContent);
        tooltip.classList.add('active');
      }
    });

    item.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
}

function initFeatTooltips() {
  const tooltip = document.getElementById('featTooltip');
  const tooltipContent = document.getElementById('featTooltipContent');
  if (!tooltip || !tooltipContent) return;

  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const tooltipId = card.dataset.tooltip;
      const template = document.getElementById('feat-tooltip-' + tooltipId);
      if (template) {
        tooltipContent.innerHTML = template.innerHTML;
        applyTranslationsToElement(tooltipContent);
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
        tooltip.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
}

// === TRANSACTION FEED WIDGET ===
const MEMPOOL_WS = 'wss://mempool.space/api/v1/ws';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,xof';

const wallets = [
  { name: 'MTN MoMo', country: "Côte d'Ivoire", class: 'wallet-mtn', flag: '🇨🇮' },
  { name: 'Moov Money', country: 'Burkina Faso', class: 'wallet-moov', flag: '🇧🇫' },
  { name: 'Celtiis', country: 'Bénin', class: 'wallet-celtiis', flag: '🇧🇯' },
  { name: 'Togocel', country: 'Togo', class: 'wallet-togocel', flag: '🇹🇬' }
];

let currentWalletIndex = 0;
let currentPrice = { usd: 83000, xof: 54365000 }; // Fallback: USD/BTC and XOF/BTC
let txCount = 0;
const MAX_VISIBLE_TX = 6;
let fallbackInterval = null; // Track fallback interval

function getNextWallet() {
  const wallet = wallets[currentWalletIndex % wallets.length];
  currentWalletIndex++;
  return wallet;
}

function connectMempool() {
  const ws = new WebSocket(MEMPOOL_WS);
  
  ws.onopen = () => {
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Conectado • Mempool';
      statusEl.style.color = '#22c55e';
    }
    ws.send(JSON.stringify({ action: 'subscribe', data: 'mempool' }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.txid && data.vout) {
      const totalValue = data.vout.reduce((sum, out) => sum + (out.value || 0), 0);
      addTransaction({ txid: data.txid, value: totalValue, fee: data.fee || 0 });
    }
  };
  
  ws.onerror = () => {
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Error de conexión • Usando datos simulados';
      statusEl.style.color = '#f59e0b';
    }
    startFallbackMode();
  };
  
  ws.onclose = () => {
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Desconectado';
      statusEl.style.color = '#ef4444';
    }
    setTimeout(connectMempool, 5000);
  };
}

function startFallbackMode() {
  if (fallbackInterval) return;
  fallbackInterval = setInterval(() => {
    const simulatedTx = {
      txid: Array(64).fill().map(() => Math.random().toString(36)[2]).join(''),
      fee: Math.floor(Math.random() * 500) + 50,
      value: Math.floor(Math.random() * 500000) + 10000
    };
    addTransaction(simulatedTx);
  }, 10000);
}

function addTransaction(tx) {
  const wallet = getNextWallet();
  const sats = tx.value;
  // Calculate XOF from sats: sats/100000000 * currentPrice.xof
  const xofValue = Math.floor((sats / 100000000) * currentPrice.xof);
  const hashShort = tx.txid.substring(0, 4) + '...' + tx.txid.substring(60);
  
  const txHtml = `
    <div class="tx-item">
      <div class="tx-connector"></div>
      <div class="tx-dot ${wallet.class}">${wallet.flag}</div>
      <div class="tx-content">
        <div class="tx-wallet">
          <span class="tx-wallet-name">${wallet.name}</span>
          <span class="tx-country">${wallet.country}</span>
        </div>
        <div class="tx-amount">
          <span class="tx-sats">${sats.toLocaleString()} sats</span>
          <span class="tx-xof">~${xofValue.toLocaleString()} XOF</span>
        </div>
        <div class="tx-hash">${hashShort}</div>
        <span class="tx-confirmed">✓ Confirmé</span>
      </div>
    </div>
  `;
  
  const timeline = document.getElementById('txTimelineHero');
  if (timeline) {
    timeline.insertAdjacentHTML('afterbegin', txHtml);
    
    txCount++;
    
    const items = timeline.querySelectorAll('.tx-item');
    if (items.length > MAX_VISIBLE_TX) {
      items[items.length - 1].remove();
    }
  }
}

function initTxFeed() {
  startFallbackMode();
  connectMempool();
}

document.addEventListener('DOMContentLoaded', initTxFeed);
