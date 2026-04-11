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
  setInterval(fetchMempoolData, 120000);
  initFeatTooltips();
  initComoFuncionaScroll();
  
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
    const images = carouselTrack.querySelectorAll('img');
    let loadedCount = 0;
    if (images.length === 0) {
      carouselTrack.classList.add('loaded');
    } else {
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount >= images.length) {
              carouselTrack.classList.add('loaded');
            }
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount >= images.length) {
              carouselTrack.classList.add('loaded');
            }
          });
        }
      });
    }
  }
});

function initComoFuncionaScroll() {
  const wrapper = document.getElementById('como-funciona-wrapper');
  const pathProgress = document.getElementById('path-progress');
  if (!wrapper || !pathProgress) return;

  const pathLength = pathProgress.getTotalLength();
  pathProgress.style.strokeDasharray = pathLength;
  pathProgress.style.strokeDashoffset = pathLength;

  const stepDots = document.querySelectorAll('#map-svg .step-dot');
  const stepCards = document.querySelectorAll('.steps-section .step-card');
  
  const pathSegments = [
    { end: 0.20 },
    { end: 0.45 },
    { end: 0.70 },
    { end: 0.90 }
  ];

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0
  };

  let currentStep = -1;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(stepCards).indexOf(entry.target);
        if (index >= 0 && index < pathSegments.length && index > currentStep) {
          currentStep = index;
          const progress = pathSegments[index].end;
          const offset = pathLength * (1 - progress);
          pathProgress.style.strokeDashoffset = offset;
          
          stepDots.forEach((dot, i) => {
            if (i <= index) {
              dot.setAttribute('fill', '#4dd9c0');
              dot.setAttribute('r', i === index ? '12' : '10');
              dot.setAttribute('stroke', '#0f1f30');
            } else {
              dot.setAttribute('fill', '#2a4a68');
              dot.setAttribute('r', '10');
            }
          });
        }
      }
    });
  }, observerOptions);

  stepCards.forEach(card => observer.observe(card));
}

function initFeatTooltips() {
  const tooltip = document.getElementById('featTooltip');
  const tooltipContent = document.getElementById('featTooltipContent');
  if (!tooltip || !tooltipContent) return;

  let tooltipTimeout;
  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        const tooltipId = card.dataset.tooltip;
        const template = document.getElementById('feat-tooltip-' + tooltipId);
        if (template) {
          tooltipContent.innerHTML = template.innerHTML;
          applyTranslationsToElement(tooltipContent);
          tooltip.style.left = (e.clientX + 15) + 'px';
          tooltip.style.top = (e.clientY + 15) + 'px';
          tooltip.classList.add('active');
        }
      }, 150);
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(tooltipTimeout);
      tooltip.classList.remove('active');
    });
  });
}

// === TRANSACTION FEED WIDGET ===
const MEMPOOL_WS = 'wss://mempool.space/api/v1/ws';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,xof';

const wallets = [
  { name: 'MTN MoMo', country: "Côte d'Ivoire", class: 'wallet-mtn', emoji: '🇨🇮' },
  { name: 'Moov Money', country: 'Burkina Faso', class: 'wallet-moov', emoji: '🇧🇫' },
  { name: 'Celtiis', country: 'Bénin', class: 'wallet-celtiis', emoji: '🇧🇯' },
  { name: 'Togocel', country: 'Togo', class: 'wallet-togocel', emoji: '🇹🇬' }
];

let currentWalletIndex = 0;
let currentPrice = { usd: 83000, xof: 54365000 }; // Fallback: USD/BTC and XOF/BTC
let txCount = 0;
const MAX_VISIBLE_TX = 3;
let fallbackInterval = null;
let mempoolWs = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let isPageVisible = true;

function getNextWallet() {
  const wallet = wallets[currentWalletIndex % wallets.length];
  currentWalletIndex++;
  return wallet;
}

function disconnectMempool() {
  if (mempoolWs) {
    mempoolWs.close();
    mempoolWs = null;
  }
  reconnectAttempts = 0;
}

function connectMempool() {
  if (!isPageVisible || mempoolWs) return;
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
  
  mempoolWs = new WebSocket(MEMPOOL_WS);
  
  mempoolWs.onopen = () => {
    reconnectAttempts = 0;
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Conectado • Mempool';
      statusEl.style.color = '#22c55e';
    }
    mempoolWs.send(JSON.stringify({ action: 'subscribe', data: 'mempool' }));
  };
  
  mempoolWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.txid && data.vout) {
        const totalValue = data.vout.reduce((sum, out) => sum + (out.value || 0), 0);
        addTransaction({ txid: data.txid, value: totalValue, fee: data.fee || 0 });
      }
    } catch (e) {}
  };
  
  mempoolWs.onerror = () => {
    reconnectAttempts++;
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Error de conexión';
      statusEl.style.color = '#f59e0b';
    }
    if (!fallbackInterval && isPageVisible) {
      startFallbackMode();
    }
  };
  
  mempoolWs.onclose = () => {
    mempoolWs = null;
    const statusEl = document.getElementById('connectionStatusHero');
    if (statusEl) {
      statusEl.textContent = 'Reconectando...';
      statusEl.style.color = '#ef4444';
    }
    if (isPageVisible && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(connectMempool, 15000);
    }
  };
}

function startFallbackMode() {
  if (fallbackInterval || !isPageVisible) return;
  
  const simulatedTx = {
    txid: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    fee: Math.floor(Math.random() * 500) + 50,
    value: Math.floor(Math.random() * 500000) + 10000
  };
  addTransaction(simulatedTx);
  
  fallbackInterval = setInterval(() => {
    const simulatedTx = {
      txid: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      fee: Math.floor(Math.random() * 500) + 50,
      value: Math.floor(Math.random() * 500000) + 10000
    };
    addTransaction(simulatedTx);
  }, 8000);
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
      <div class="tx-dot ${wallet.class}">${wallet.emoji ? wallet.emoji : `<img class="tx-wallet-icon" src="${wallet.icon}" alt="${wallet.name}" width="24" height="24">`}</div>
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

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPageVisible = false;
    if (fallbackInterval) {
      clearInterval(fallbackInterval);
      fallbackInterval = null;
    }
    disconnectMempool();
  } else {
    isPageVisible = true;
    reconnectAttempts = 0;
    if (!fallbackInterval) {
      startFallbackMode();
    }
    connectMempool();
  }
});
