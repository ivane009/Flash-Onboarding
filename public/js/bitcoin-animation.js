const COLORS = {
  background: '#0f172a',
  bitcoinMain: '#67cbe1',
  accent: '#00d4aa',
  orbitBg: '#1e293b',
  orbitBorder: '#334155',
  white: '#ffffff',
  black: '#000000'
};

const ORBITING_COINS = [
  { name: 'Blink', sigle: 'BL', domain: 'blink.sv', url: 'https://blink.sv' },
  { name: 'Wallet of Satoshi', sigle: 'WoS', domain: 'walletofsatoshi.com', url: 'https://walletofsatoshi.com' },
  { name: 'Machankura', sigle: 'MC', domain: 'machankura.com', url: 'https://machankura.com' },
  { name: 'Breez', sigle: 'BR', domain: 'breez.technology', url: 'https://breez.technology' },
  { name: 'BlueWallet', sigle: 'BW', domain: 'bluewallet.io', url: 'https://bluewallet.io' },
  { name: 'BTCPay Server', sigle: 'BTC', domain: 'btcpayserver.org', url: 'https://btcpayserver.org' },
  { name: 'ZeusLN', sigle: 'ZE', domain: 'zeusln.app', url: 'https://zeusln.app' },
  { name: 'Alby', sigle: 'AL', domain: 'getalby.com', url: 'https://getalby.com' },
  { name: 'Phoenix', sigle: 'PH', domain: 'phoenix.acinq.co', url: 'https://phoenix.acinq.co' },
  { name: 'Muun', sigle: 'MU', domain: 'muun.com', url: 'https://muun.com' },
  { name: 'Strike', sigle: 'ST', domain: 'strike.me', url: 'https://strike.me' },
  { name: 'Bull Bitcoin', sigle: 'BB', domain: 'bullbitcoin.com', url: 'https://bullbitcoin.com' },
  { name: 'Blitz Wallet', sigle: 'BLZ', domain: 'blitz-wallet.com', url: 'https://blitz-wallet.com' },
  { name: 'Bitkit', sigle: 'BK', domain: 'bitkit.to', url: 'https://bitkit.to' },
  { name: 'Aqua Wallet', sigle: 'AQ', domain: 'aquawallet.io', url: 'https://aquawallet.io' }
];

const FLOATING_COINS_POSITIONS = [
  { x: 0.06, y: 0.1 },
  { x: 0.94, y: 0.08 },
  { x: 0.08, y: 0.9 },
  { x: 0.92, y: 0.92 },
  { x: 0.5, y: 0.03 }
];

class BitcoinAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.orbitAngle = 0;
    this.floatingCoins = [];
    this.coinImages = {};
    this.speedLines = [];
    this.iconsLoaded = false;
    this.loadedCount = 0;
    this.walletPositions = [];
    this.btcImage = new Image();
    this.btcImageLoaded = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.hoveredWalletIndex = -1;
    this.isMouseOver = false;
    this.needsRedraw = true;
    
    this.resize();
    this.setupFloatingCoins();
    this.setupSpeedLines();
    this.loadCoinImages();
    this.loadBtcImage();
    this.setupClickHandler();
    this.setupMouseTracking();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  setupMouseTracking() {
    let lastMove = 0;
    const throttleMs = 100;
    
    this.canvas.addEventListener('mouseenter', () => {
      this.isMouseOver = true;
      this.needsRedraw = true;
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMove < throttleMs) return;
      lastMove = now;
      
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      
      const prevHovered = this.hoveredWalletIndex;
      this.hoveredWalletIndex = -1;
      for (let i = 0; i < this.walletPositions.length; i++) {
        const w = this.walletPositions[i];
        if (this.mouseX >= w.x && this.mouseX <= w.x + w.width &&
            this.mouseY >= w.y && this.mouseY <= w.y + w.height) {
          this.hoveredWalletIndex = i;
          break;
        }
      }
      
      if (prevHovered !== this.hoveredWalletIndex) {
        this.needsRedraw = true;
      }
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseOver = false;
      this.hoveredWalletIndex = -1;
      this.needsRedraw = true;
    });
  }
  
  loadBtcImage() {
    this.btcImage.onload = () => {
      this.btcImageLoaded = true;
    };
    this.btcImage.onerror = () => {
      console.error('Failed to load btc.png');
    };
    this.btcImage.src = '/img/btc.png';
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }
  
  loadCoinImages() {
    const totalCoins = ORBITING_COINS.length;
    
    ORBITING_COINS.forEach(coin => {
      const img = new Image();
      img.onload = () => {
        this.loadedCount++;
        if (this.loadedCount >= totalCoins) {
          this.iconsLoaded = true;
        }
      };
      img.onerror = () => {
        this.loadedCount++;
        if (this.loadedCount >= totalCoins) {
          this.iconsLoaded = true;
        }
      };
      img.src = `https://www.google.com/s2/favicons?domain=${coin.domain}&sz=128`;
      this.coinImages[coin.name] = img;
    });
  }
  
  setupClickHandler() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      for (const wallet of this.walletPositions) {
        if (x >= wallet.x && x <= wallet.x + wallet.width &&
            y >= wallet.y && y <= wallet.y + wallet.height) {
          window.open(wallet.url, '_blank', 'noopener,noreferrer');
          break;
        }
      }
    });
    
    this.canvas.style.cursor = 'pointer';
  }
  
  setupFloatingCoins() {
    this.floatingCoins = FLOATING_COINS_POSITIONS.map((pos, i) => ({
      x: pos.x * this.width,
      y: pos.y * this.height,
      baseY: pos.y * this.height,
      radius: 10 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.01,
      color: i % 2 === 0 ? COLORS.bitcoinMain : COLORS.orbitBg
    }));
  }
  
  setupSpeedLines() {
    this.speedLines = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      this.speedLines.push({
        angle: angle,
        length: 30 + Math.random() * 40,
        offset: 100 + Math.random() * 30,
        speed: 0.015 + Math.random() * 0.015
      });
    }
  }
  
  drawBackground() {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  drawLightning() {
    const ctx = this.ctx;
    const x = this.width - 80;
    const y = 50;
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = COLORS.bitcoinMain;
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 25, y + 35);
    ctx.lineTo(x - 5, y + 35);
    ctx.lineTo(x - 22, y + 75);
    ctx.lineTo(x + 18, y + 25);
    ctx.lineTo(x - 2, y + 25);
    ctx.lineTo(x + 12, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  
  drawCentralBitcoin(time) {
    if (!this.btcImageLoaded) return;
    
    const ctx = this.ctx;
    const pulse = Math.sin(time * 0.002) * 0.15 + 0.85;
    
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    
    const imgSize = 180 * pulse;
    ctx.drawImage(this.btcImage, -imgSize/2, -imgSize/2, imgSize, imgSize);
    
    ctx.restore();
  }
  
  drawConnectionRays(time) {
    const ctx = this.ctx;
    const orbitRadius = 280;
    const btcRadius = 95;
    
    ORBITING_COINS.forEach((coin, i) => {
      const baseAngle = (Math.PI * 2 / ORBITING_COINS.length) * i;
      const angle = baseAngle + this.orbitAngle;
      
      const startX = this.centerX + Math.cos(angle) * btcRadius;
      const startY = this.centerY + Math.sin(angle) * btcRadius;
      const walletX = this.centerX + Math.cos(angle) * orbitRadius;
      const walletY = this.centerY + Math.sin(angle) * orbitRadius;
      
      const pulse = Math.sin(time * 0.003 + i * 0.5) * 0.3 + 0.7;
      
      ctx.save();
      ctx.strokeStyle = `rgba(103, 203, 225, ${0.2 * pulse})`;
      ctx.lineWidth = 3;
      ctx.filter = 'blur(4px)';
      ctx.setLineDash([5, 10]);
      ctx.lineDashOffset = -time * 0.02;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(walletX, walletY);
      ctx.stroke();
      
      ctx.restore();
    });
  }
  
  drawOrbitingCoins(time) {
    const ctx = this.ctx;
    const orbitRadius = 280;
    const iconWidth = 70;
    const iconHeight = 85;
    const isHovered = this.hoveredWalletIndex !== -1;
    
    this.walletPositions = [];
    
    ORBITING_COINS.forEach((coin, i) => {
      const baseAngle = (Math.PI * 2 / ORBITING_COINS.length) * i;
      const angle = baseAngle + this.orbitAngle;
      
      const x = this.centerX + Math.cos(angle) * orbitRadius;
      const y = this.centerY + Math.sin(angle) * orbitRadius;
      
      const hovered = i === this.hoveredWalletIndex;
      const scale = hovered ? 1.3 : 1;
      const currentIconWidth = iconWidth * scale;
      const currentIconHeight = iconHeight * scale;
      
      const rectX = x - currentIconWidth / 2;
      const rectY = y - currentIconHeight / 2;
      
      this.walletPositions.push({
        x: rectX,
        y: rectY,
        width: currentIconWidth,
        height: currentIconHeight,
        url: coin.url
      });
      
      ctx.save();
      
      if (hovered) {
        ctx.shadowColor = 'rgba(103, 203, 225, 0.6)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 0;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
      }
      
      const radius = 14;
      
      ctx.fillStyle = hovered ? 'rgba(103, 203, 225, 0.3)' : COLORS.orbitBg;
      ctx.strokeStyle = hovered ? COLORS.bitcoinMain : COLORS.orbitBorder;
      ctx.lineWidth = hovered ? 3 : 2;
      
      ctx.beginPath();
      ctx.roundRect(rectX, rectY, currentIconWidth, currentIconHeight, radius);
      ctx.fill();
      ctx.stroke();
      
      ctx.shadowColor = 'transparent';
      
      const img = this.coinImages[coin.name];
      const imgSize = (hovered ? 50 : 40);
      const imgY = rectY + 12 * scale;
      
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x - imgSize/2, imgY, imgSize, imgSize);
      } else {
        ctx.fillStyle = '#67cbe1';
        ctx.beginPath();
        ctx.arc(x, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${hovered ? 14 : 12}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coin.sigle, x, imgY + imgSize/2);
      }
      
      ctx.fillStyle = COLORS.white;
      ctx.font = `bold ${hovered ? 13 : 11}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textY = rectY + currentIconHeight - 12 * scale;
      const maxWidth = currentIconWidth - 8;
      
      if (ctx.measureText(coin.name).width > maxWidth && coin.name.length > 10) {
        ctx.font = `bold ${hovered ? 11 : 9}px Inter, Arial, sans-serif`;
      }
      ctx.fillText(coin.name, x, textY);
      
      ctx.restore();
    });
  }
  
  drawFloatingCoins(time) {
    const ctx = this.ctx;
    
    this.floatingCoins.forEach((coin, i) => {
      const floatY = Math.sin(time * coin.speed + coin.phase) * 8;
      const x = coin.x;
      const y = coin.baseY + floatY;
      
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      
      ctx.fillStyle = coin.color;
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, coin.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(x - coin.radius * 0.3, y - coin.radius * 0.3, coin.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }
  
  drawSpeedLines(time) {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    this.speedLines.forEach((line, i) => {
      const angle = line.angle + this.orbitAngle * 0.5;
      const pulse = Math.sin(time * line.speed + i) * 10;
      const offset = line.offset + pulse;
      
      const x1 = this.centerX + Math.cos(angle) * offset;
      const y1 = this.centerY + Math.sin(angle) * offset;
      const x2 = this.centerX + Math.cos(angle) * (offset + line.length);
      const y2 = this.centerY + Math.sin(angle) * (offset + line.length);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    
    ctx.restore();
  }
  
  animate(time = 0) {
    if (document.hidden) {
      this.animationId = null;
      return;
    }
    
    if (this.needsRedraw) {
      this.drawBackground();
      this.drawCentralBitcoin(time);
      this.drawStaticRays();
      this.drawStaticOrbitingCoins();
      this.needsRedraw = false;
    } else {
      this.drawCentralBitcoin(time);
    }
    
    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }
  
  drawStaticRays() {
    const ctx = this.ctx;
    const orbitRadius = 280;
    const btcRadius = 95;
    
    ORBITING_COINS.forEach((coin, i) => {
      const baseAngle = (Math.PI * 2 / ORBITING_COINS.length) * i;
      
      const startX = this.centerX + Math.cos(baseAngle) * btcRadius;
      const startY = this.centerY + Math.sin(baseAngle) * btcRadius;
      const walletX = this.centerX + Math.cos(baseAngle) * orbitRadius;
      const walletY = this.centerY + Math.sin(baseAngle) * orbitRadius;
      
      ctx.save();
      ctx.strokeStyle = 'rgba(103, 203, 225, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(walletX, walletY);
      ctx.stroke();
      ctx.restore();
    });
  }
  
  drawStaticOrbitingCoins() {
    const ctx = this.ctx;
    const orbitRadius = 280;
    const iconWidth = 70;
    const iconHeight = 85;
    
    this.walletPositions = [];
    
    ORBITING_COINS.forEach((coin, i) => {
      const baseAngle = (Math.PI * 2 / ORBITING_COINS.length) * i;
      const isHovered = i === this.hoveredWalletIndex;
      
      const x = this.centerX + Math.cos(baseAngle) * orbitRadius;
      const y = this.centerY + Math.sin(baseAngle) * orbitRadius;
      
      const scale = isHovered ? 1.1 : 1;
      const currentWidth = iconWidth * scale;
      const currentHeight = iconHeight * scale;
      
      const rectX = x - currentWidth / 2;
      const rectY = y - currentHeight / 2;
      
      this.walletPositions.push({
        x: rectX,
        y: rectY,
        width: currentWidth,
        height: currentHeight,
        url: coin.url
      });
      
      ctx.save();
      
      if (isHovered) {
        ctx.shadowColor = 'rgba(103, 203, 225, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 0;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
      }
      
      const radius = 14;
      
      ctx.fillStyle = isHovered ? 'rgba(103, 203, 225, 0.2)' : COLORS.orbitBg;
      ctx.strokeStyle = isHovered ? 'rgba(103, 203, 225, 0.6)' : COLORS.orbitBorder;
      ctx.lineWidth = isHovered ? 2.5 : 2;
      
      ctx.beginPath();
      ctx.roundRect(rectX, rectY, currentWidth, currentHeight, radius);
      ctx.fill();
      ctx.stroke();
      
      ctx.shadowColor = 'transparent';
      
      const img = this.coinImages[coin.name];
      const imgSize = 40 * scale;
      const imgY = rectY + 12 * scale;
      
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x - imgSize/2, imgY, imgSize, imgSize);
      } else {
        ctx.fillStyle = '#67cbe1';
        ctx.beginPath();
        ctx.arc(x, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coin.sigle, x, imgY + imgSize/2);
      }
      
      ctx.fillStyle = COLORS.white;
      ctx.font = `bold ${11 * scale}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textY = rectY + currentHeight - 12 * scale;
      const maxWidth = currentWidth - 8;
      
      if (ctx.measureText(coin.name).width > maxWidth && coin.name.length > 10) {
        ctx.font = `bold ${9 * scale}px Inter, Arial, sans-serif`;
      }
      ctx.fillText(coin.name, x, textY);
      
      ctx.restore();
    });
  }
  
  startAnimation() {
    if (this.animationId) return;
    this.animate();
  }
  
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

let bitcoinAnim = null;

document.addEventListener('DOMContentLoaded', () => {
  bitcoinAnim = new BitcoinAnimation('bitcoinCanvas');
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (bitcoinAnim) bitcoinAnim.stopAnimation();
  } else {
    if (bitcoinAnim) bitcoinAnim.startAnimation();
  }
});