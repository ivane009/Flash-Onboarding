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
    const [pricesRes, blockRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur'),
      fetch('https://blockchain.info/q/getblockcount')
    ]);

    const prices = await pricesRes.json();
    const blockHeight = await blockRes.text();
    const usdPrice = prices.bitcoin?.usd || 83000;

    // Update ticker
    const btcUsdEl = document.getElementById('btc-usd');
    const btcEurEl = document.getElementById('btc-eur');
    const btcBlockEl = document.getElementById('btc-block');
    const btcPriceEl = document.getElementById('btc-price');
    const btcFeesEl = document.getElementById('btc-fees');
    if (btcUsdEl) btcUsdEl.textContent = '$' + usdPrice.toLocaleString();
    if (btcEurEl) btcEurEl.textContent = '€' + (prices.bitcoin?.eur || 76000).toLocaleString();
    if (btcBlockEl) btcBlockEl.textContent = '#' + parseInt(blockHeight).toLocaleString();
    if (btcPriceEl) btcPriceEl.textContent = '$' + usdPrice.toLocaleString();
    if (btcFeesEl) btcFeesEl.textContent = '10';

    // Update widget prices
    const widgetBtcUsd = document.querySelector('.btc-usd');
    const widgetBtcXof = document.querySelector('.btc-xof');
    if (widgetBtcUsd) widgetBtcUsd.textContent = `BTC: $${usdPrice.toLocaleString()}`;
    if (widgetBtcXof) widgetBtcXof.textContent = `XOF: ${(usdPrice * 655).toLocaleString()}`;

    // Save prices for transaction calculations
    currentPrice.usd = usdPrice;
    currentPrice.xof = usdPrice * 655;
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
  localStorage.setItem('lang', lang);
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
  const savedLang = localStorage.getItem('lang') || 'fr';
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
  
  const pathSegments = [0.20, 0.45, 0.70, 0.90, 1.0];

  const updatePath = (progress) => {
    const offset = pathLength * (1 - progress);
    pathProgress.style.strokeDashoffset = offset;
    
    stepDots.forEach((dot, i) => {
      const segmentEnd = pathSegments[i];
      if (progress >= segmentEnd) {
        dot.setAttribute('fill', '#4dd9c0');
        dot.setAttribute('r', i === stepDots.length - 1 && progress >= 1 ? '12' : (progress >= pathSegments[i] && (i === 0 || progress < pathSegments[i - 1] + 0.05) ? '12' : '10'));
        dot.setAttribute('stroke', '#0f1f30');
      } else {
        dot.setAttribute('fill', '#2a4a68');
        dot.setAttribute('r', '10');
      }
    });
  };

  const handleScroll = () => {
    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = rect.top;
    const wrapperHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    if (wrapperTop > viewportHeight) {
      updatePath(0);
      return;
    }
    
    if (wrapperTop + wrapperHeight < 0) {
      updatePath(1);
      return;
    }
    
    const scrolled = Math.max(0, -wrapperTop);
    const totalScrollable = wrapperHeight - viewportHeight;
    const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
    
    updatePath(progress);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
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
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    startFallbackMode();
    return;
  }
  
  try {
    mempoolWs = new WebSocket(MEMPOOL_WS);
    
    mempoolWs.onopen = () => {
      reconnectAttempts = 0;
      const statusEl = document.getElementById('connectionStatusHero');
      if (statusEl) {
        statusEl.textContent = 'Conectado • Mempool';
        statusEl.style.color = '#22c55e';
      }
      try { mempoolWs.send(JSON.stringify({ action: 'subscribe', data: 'mempool' })); } catch(e) {}
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
        statusEl.textContent = 'Demo modo';
        statusEl.style.color = '#f59e0b';
      }
      if (!fallbackInterval && isPageVisible) {
        startFallbackMode();
      }
    };
    
    mempoolWs.onclose = () => {
      mempoolWs = null;
      if (isPageVisible && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setTimeout(connectMempool, 15000);
      } else if (isPageVisible) {
        startFallbackMode();
      }
    };
  } catch (e) {
    startFallbackMode();
  }
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

// === BLOCK MINING ANIMATION ===
const MAX_VISIBLE_BLOCKS = 5;
let blockData = {
  currentHeight: 893421,
  blocks: [],
  btcPrice: 0,
  mempoolFee: 0,
  miningProgress: 0,
  currentNonce: 0
};

function formatHash(hash) {
  if (!hash) return '0000000000000000';
  return hash.slice(0, 8) + '...';
}

function timeAgo(timestamp) {
  if (!timestamp) return '0m ago';
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  if (seconds < 60) return seconds + 's ago';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  return hours + 'h ago';
}

function createBlockElement(block, isLatest) {
  const div = document.createElement('div');
  div.className = 'bm-block ' + (isLatest ? 'latest' : 'old');
  div.innerHTML = `
    <div class="bm-block-icon"></div>
    <div class="bm-block-info">
      <span class="bm-block-number">#${block.height.toLocaleString()}</span>
      <span class="bm-block-hash">${formatHash(block.hash)}</span>
      <span class="bm-block-time">${timeAgo(block.time)}</span>
    </div>
  `;
  return div;
}

function renderBlocks() {
  const chain = document.getElementById('bmChain');
  if (!chain) return;
  chain.innerHTML = '';
  
  const visibleBlocks = blockData.blocks.slice(0, MAX_VISIBLE_BLOCKS);
  visibleBlocks.forEach((block, index) => {
    if (index > 0) {
      const connector = document.createElement('div');
      connector.className = 'bm-connector';
      chain.appendChild(connector);
    }
    const isLatest = index === 0;
    const blockEl = createBlockElement(block, isLatest);
    blockEl.style.animationDelay = (index * 0.1) + 's';
    chain.appendChild(blockEl);
  });
}

function updateStats() {
  const blockEl = document.getElementById('bmBlockHeight');
  const priceEl = document.getElementById('bmBtcPrice');
  const mempoolEl = document.getElementById('bmMempool');
  
  if (blockEl) blockEl.textContent = '#' + blockData.currentHeight.toLocaleString();
  if (priceEl) priceEl.textContent = '$' + blockData.btcPrice.toLocaleString();
  if (mempoolEl) mempoolEl.textContent = blockData.mempoolFee + ' sat/vB';
}

function updateMiningBar() {
  const percentEl = document.getElementById('bmMiningPercent');
  const fillEl = document.getElementById('bmProgressFill');
  const nonceEl = document.getElementById('bmNonce');
  
  if (percentEl) percentEl.textContent = blockData.miningProgress + '%';
  if (fillEl) fillEl.style.width = blockData.miningProgress + '%';
  if (nonceEl) nonceEl.textContent = 'nonce: 0x' + blockData.currentNonce.toString(16).padStart(16, '0');
}

async function fetchBlockchainData() {
  try {
    const [blockRes, priceRes, mempoolRes] = await Promise.all([
      fetch('https://blockchain.info/latestblock'),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
      fetch('https://mempool.space/api/v1/fees/recommended')
    ]);
    
    const blockData_json = await blockRes.json();
    const priceData = await priceRes.json();
    const mempoolData = await mempoolRes.json();
    
    const newHeight = blockData_json.height;
    
    if (newHeight !== blockData.currentHeight) {
      blockData.currentHeight = newHeight;
      
      const newBlock = {
        height: newHeight,
        hash: blockData_json.hash,
        time: blockData_json.time
      };
      
      blockData.blocks.unshift(newBlock);
      if (blockData.blocks.length > MAX_VISIBLE_BLOCKS + 2) {
        blockData.blocks.pop();
      }
      
      renderBlocks();
    }
    
    blockData.btcPrice = priceData.bitcoin?.usd || 75692;
    blockData.mempoolFee = mempoolData.fastestFee || 10;
    
    updateStats();
    
    const statusEl = document.getElementById('bmStatus');
    if (statusEl) statusEl.textContent = 'en vivo';
    
  } catch (error) {
    console.warn('Error fetching blockchain data:', error);
    
    if (blockData.blocks.length === 0) {
      for (let i = 0; i < 5; i++) {
        blockData.blocks.push({
          height: blockData.currentHeight - i,
          hash: '0000000000000000000000000000000000000000000000000000000000000000',
          time: Math.floor(Date.now() / 1000) - (i * 600)
        });
      }
      renderBlocks();
    }
  }
}

function animateMining() {
  blockData.miningProgress = (blockData.miningProgress + Math.random() * 2) % 100;
  blockData.currentNonce = Math.floor(Math.random() * 0xFFFFFFFFFFFFFFFF);
  updateMiningBar();
  
  if (blockData.miningProgress > 95) {
    blockData.miningProgress = 0;
    blockData.currentHeight++;
    
    blockData.blocks.unshift({
      height: blockData.currentHeight,
      hash: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      time: Math.floor(Date.now() / 1000)
    });
    
    if (blockData.blocks.length > MAX_VISIBLE_BLOCKS + 2) {
      blockData.blocks.pop();
    }
    
    renderBlocks();
    updateStats();
  }
}

function initBlockMining() {
  fetchBlockchainData();
  
  setInterval(fetchBlockchainData, 30000);
  
  setInterval(() => {
    blockData.btcPrice = blockData.btcPrice || 75692;
    const priceChange = (Math.random() - 0.5) * 100;
    blockData.btcPrice = Math.max(70000, blockData.btcPrice + priceChange);
    updateStats();
  }, 60000);
  
  setInterval(animateMining, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  initBlockMining();
});
