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

function updateTicker() {
  let btcBase = 83200;
  setInterval(() => {
    btcBase += (Math.random() - 0.49) * 80;
    btcBase = Math.round(btcBase);
    document.getElementById('btc-ticker').textContent = '$' + btcBase.toLocaleString();
  }, 3000);
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
}

document.addEventListener('DOMContentLoaded', async () => {
  const savedLang = sessionStorage.getItem('lang') || 'fr';
  const langSelect = document.querySelector('.lang-select');
  if (langSelect) {
    langSelect.value = savedLang;
  }
  await loadTranslations(savedLang);
  calcBtc();
  updateTicker();
  initAfricaWidget();
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
    card.addEventListener('mouseenter', () => {
      const tooltipId = card.dataset.tooltip;
      const template = document.getElementById('feat-tooltip-' + tooltipId);
      if (template) {
        tooltipContent.innerHTML = template.innerHTML;
        applyTranslationsToElement(tooltipContent);
        tooltip.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
}

const fallbackTxData = [
  { btc: '₿0.0042', xof: '28,450 XOF' },
  { btc: '₿0.0015', xof: '10,150 XOF' },
  { btc: '₿0.0081', xof: '54,900 XOF' },
  { btc: '₿0.0028', xof: '18,920 XOF' },
  { btc: '₿0.0055', xof: '37,250 XOF' },
  { btc: '₿0.0011', xof: '7,450 XOF' }
];

const fallbackPrice = 83200;
const fallbackXOF = 675;

let coingeckoOk = false;
let currentBtcPrice = fallbackPrice;
let currentXOF = fallbackXOF;
let txIndex = 0;

function setStatus(dotId, ok, loading = false) {
  const dot = document.getElementById(dotId);
  if (!dot) return;
  dot.classList.remove('green', 'red', 'yellow');
  if (loading) {
    dot.classList.add('yellow');
  } else if (ok) {
    dot.classList.add('green');
  } else {
    dot.classList.add('red');
  }
}

function formatNumber(num) {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function btcToXof(sats, price, xofRate) {
  const btc = sats / 100000000;
  const usd = btc * price;
  const xof = usd * xofRate;
  return formatNumber(Math.round(xof));
}

function satsToBtc(sats) {
  return (sats / 100000000).toFixed(8);
}

function updateBubbles(txs) {
  const bubbles = [
    { amountId: 'tx-bubble-1', ...txs[0] },
    { amountId: 'tx-bubble-2', ...txs[1] },
    { amountId: 'tx-bubble-3', ...txs[2] }
  ];
  
  bubbles.forEach(b => {
    const el = document.getElementById(b.amountId);
    if (!el) return;
    const amtEl = el.querySelector('.tx-amount');
    const xofEl = el.querySelector('.tx-xof');
    if (amtEl) amtEl.textContent = b.btc;
    if (xofEl) xofEl.textContent = b.xof;
  });
}

function rotateBubbles(txs) {
  txIndex = (txIndex + 3) % txs.length;
  const selected = [txs[txIndex], txs[(txIndex + 1) % txs.length], txs[(txIndex + 2) % txs.length]];
  updateBubbles(selected);
}

async function fetchCoingeckoData() {
  try {
    setStatus('coingecko-status', false, true);
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_last_updated_at=true');
    if (!res.ok) throw new Error('Coingecko error');
    const data = await res.json();
    currentBtcPrice = data.bitcoin.usd;
    coingeckoOk = true;
    setStatus('coingecko-status', true);
    document.getElementById('btc-price').textContent = '$' + formatNumber(currentBtcPrice);
    document.getElementById('btc-xof').textContent = formatNumber(Math.round(currentBtcPrice * currentXOF)) + ' XOF';
    return true;
  } catch (e) {
    coingeckoOk = false;
    setStatus('coingecko-status', false);
    return false;
  }
}

async function initAfricaWidget() {
  document.getElementById('btc-price').textContent = '$' + formatNumber(fallbackPrice);
  document.getElementById('btc-xof').textContent = formatNumber(fallbackPrice * fallbackXOF) + ' XOF';
  
  const ok = await fetchCoingeckoData();
  if (!ok) {
    currentBtcPrice = fallbackPrice;
    currentXOF = fallbackXOF;
  }
  
  let txs = fallbackTxData;
  
  updateBubbles(txs.slice(0, 3));
  
  setInterval(() => {
    rotateBubbles(txIndex < txs.length - 3 ? txs : fallbackTxData);
  }, 3000);
  
  const txCount = formatNumber(Math.floor(Math.random() * 5000) + 12000);
  const countEl = document.getElementById('tx-count');
  if (countEl) countEl.textContent = txCount;
}
