const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'flash-secret-key-2024';

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const users = new Map();
const transactions = [];
let otpStore = new Map();

// Pre-configured user (your account)
users.set('ivanelias009@gmail.com', {
  id: 'user-ivane-001',
  name: 'Ivane',
  email: 'ivanelias009@gmail.com',
  password: 'gohanpicoro',
  whatsapp: '+22997970000',
  country: 'BJ',
  level: 0,
  role: 'client',
  kyc_verified: true,
  created_at: new Date().toISOString()
});
console.log('[SERVER] Pre-configured user loaded: ivanelias009@gmail.com');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── AUTH ──────────────────────────────────────────────

// Register
app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password, password_confirmation, whatsapp, country } = req.body;
  
  if (!name || !email || !password || !password_confirmation) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  if (password !== password_confirmation) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  if (users.has(email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  const userId = `a${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  const user = {
    id: userId,
    name,
    email,
    password,
    whatsapp: whatsapp || '',
    country: country || 'US',
    level: 0,
    role: 'client',
    kyc_verified: false,
    created_at: new Date().toISOString()
  };
  
  users.set(email, user);
  
  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 3600000 });
  
  console.log(`[REGISTER] OTP for ${email}: ${otp}`);
  
  res.status(201).json({ 
    success: true, 
    message: 'Inscription réussie; Prochaine étape: Vérification de votre email',
    data: {
      user: {
        id: userId,
        name,
        email,
        whatsapp: whatsapp || '',
        country: country || 'US',
        created_at: new Date().toISOString()
      }
    }
  });
});

// Login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }
  
  const user = users.get(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
  
  const token = jwt.sign({ email, id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({ 
    success: true, 
    message: 'Connexion réussie',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  });
});

// Verify OTP
app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ message: 'Missing email or code' });
  }
  
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== code) {
    return res.status(400).json({ success: false, message: 'Code OTP invalide' });
  }
  
  if (Date.now() > stored.expires) {
    return res.status(400).json({ message: 'OTP expired' });
  }
  
  otpStore.delete(email);
  
  const user = users.get(email);
  if (user) {
    user.kyc_verified = true;
    users.set(email, user);
  }
  
  res.json({ success: true, message: 'Votre email a été vérifié' });
});

// Regenerate OTP
app.post('/api/v1/auth/regenerate-otp', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }
  
  if (!users.has(email)) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 3600000 });
  
  console.log(`[REGENERATE OTP] for ${email}: ${otp}`);
  
  res.json({ success: true, message: 'Un nouveau code OTP vous a été transmis.' });
});

// Reactivate Account
app.post('/api/v1/auth/reactivate', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }
  
  if (!users.has(email)) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ success: true, data: email, message: 'Un code de réactivation a été envoyé à l\'adresse email indiquée' });
});

// Logout
app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie' });
});

// Get Current User
app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        country: user.country,
        role: user.role || 'client',
        kyc_verified: user.kyc_verified || false,
        created_at: user.created_at
      }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Password Reset Request
app.post('/api/v1/auth/password/reset-request', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }
  
  if (!users.has(email)) {
    return res.json({ success: true, message: 'If email exists, reset link sent' });
  }
  
  const otp = generateOTP();
  otpStore.set(`reset:${email}`, { otp, expires: Date.now() + 3600000 });
  
  console.log(`[PASSWORD RESET] OTP for ${email}: ${otp}`);
  
  res.json({ success: true, message: 'Un code OTP de réinitialisation a été envoyé à l\'email indiqué' });
});

// Password Reset
app.post('/api/v1/auth/password/reset', (req, res) => {
  const { email, token, new_password } = req.body;
  
  if (!email || !token || !new_password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const stored = otpStore.get(`reset:${email}`);
  if (!stored || stored.otp !== token) {
    return res.status(400).json({ success: false, message: 'Code OTP invalide' });
  }
  
  if (Date.now() > stored.expires) {
    return res.status(400).json({ message: 'OTP expired' });
  }
  
  const user = users.get(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  user.password = new_password;
  users.set(email, user);
  otpStore.delete(`reset:${email}`);
  
  res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
});

// ── TRANSACTIONS ─────────────────────────────────────

// List Transactions
app.get('/api/v1/transactions', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userTxs = transactions.filter(tx => tx.userId === decoded.id);
    res.json(userTxs);
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Create Transaction
app.post('/api/v1/transactions/create', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const { type, amount, currency, paymentMethod } = req.body;
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const tx = {
      id: transactions.length + 1,
      uuid: `tx-${Date.now()}`,
      userId: decoded.id,
      type,
      amount,
      currency: currency || 'XOF',
      paymentMethod,
      status: 'completed',
      createdAt: new Date()
    };
    
    transactions.push(tx);
    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Get Transaction
app.get('/api/v1/transactions/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const tx = transactions.find(t => t.uuid === req.params.id);
  
  if (!tx) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }
  
  res.json(tx);
});

// Transaction Summary
app.get('/api/v1/transactions/resume', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userTxs = transactions.filter(tx => tx.userId === decoded.id);
    
    const buys = userTxs.filter(tx => tx.type === 'BUY_BITCOIN');
    const sells = userTxs.filter(tx => tx.type === 'SELL_BITCOIN');
    
    res.json({
      totalBuys: buys.length,
      totalSells: sells.length,
      totalAmount: buys.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      totalSats: sells.reduce((sum, tx) => sum + (tx.amount || 0), 0)
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Remaining Limit
app.get('/api/v1/transactions/remaining', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  res.json({ percentage: 100, level: 0 });
});

// Flashback Stats
app.get('/api/v1/transactions/flashback', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userTxs = transactions.filter(tx => tx.userId === decoded.id);
    const sells = userTxs.filter(tx => tx.type === 'SELL_BITCOIN');
    const buys = userTxs.filter(tx => tx.type === 'BUY_BITCOIN');
    
    res.json({
      currentStreak: sells.length,
      longestStreak: sells.length,
      totalSatsBought: buys.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      totalSatsSold: sells.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      totalFCFA: sells.reduce((sum, tx) => sum + ((tx.amount || 0) * 0.15), 0),
      totalTransactions: userTxs.length,
      daysActive: Math.floor((Date.now() - (userTxs[0]?.createdAt?.getTime() || Date.now())) / 86400000) + 1
    });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Flash API running on http://0.0.0.0:${PORT}`);
  console.log(`Test login: POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`Body: {"email":"test@test.com","password":"password123"}`);
});