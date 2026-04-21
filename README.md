# Flash Onboarding

> A modern, multilingual Bitcoin onboarding platform designed for the African market

![Bitcoin](https://img.shields.io/badge/Bitcoin-Orange?style=for-the-badge&logo=bitcoin)
![Lightning Network](https://img.shields.io/badge/Lightning%20Network-Fast-blue?style=for-the-badge&logo=lightning)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=for-the-badge&logo=javascript)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Flash is a web application that guides new users through the process of creating a Bitcoin wallet and purchasing their first sats via Lightning Network. The platform is optimized for mobile money integration across West Africa, supporting multiple languages and currencies.

### Supported Countries
- 🇧🇯 Benin
- 🇹🇬 Togo  
- 🇬🇭 Ghana
- 🇨🇮 Côte d'Ivoire
- 🇧🇫 Burkina Faso

### Supported Languages
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇵🇹 Portuguese

## ✨ Features

| Feature | Description |
|---------|-------------|
| **User Registration** | Create account with email verification |
| **OTP Verification** | 6-digit code verification with 15-minute expiration |
| **Login System** | Email/password authentication |
| **Password Reset** | Secure password recovery flow |
| **Profile Management** | Edit name, phone, country (email read-only) |
| **Multi-language** | 4 languages with easy translation system |
| **Mobile Money** | Integration with MTN MoMo, Moov Money, Celtiis |
| **Bitcoin Purchase** | Buy sats via Lightning Network |
| **Responsive Design** | Mobile-first approach |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/ivane009/Flash-Onboarding.git
cd Flash-Onboarding

# Install dependencies
npm install
```

### Running the Application

**Frontend Only (Recommended for development)**
```bash
npm start
```
Access at: http://localhost:3000

**Full Stack (Frontend + Backend)**
```bash
# Terminal 1: Start backend (port 3001)
npm run server

# Terminal 2: Start frontend (port 3000)  
npm start
```

## 📁 Project Structure

```
flash-onboarding/
├── public/                          # Static files - no build required
│   ├── index.html                   # Landing page
│   ├── flash.png                   # App logo
│   ├── favicon.ico                # Favicon
│   ├── html/                      # Application pages
│   │   ├── crear-cuenta.html     # Registration
│   │   ├── verificar-codigo.html  # OTP verification
│   │   ├── iniciar-sesion.html   # Login
│   │   ├── comprar-sats.html      # Buy Bitcoin
│   │   ├── mi-espacio.html       # Profile/Settings
│   │   └── history.html           # Transaction history
│   ├── js/                       # JavaScript modules
│   │   ├── app-crear-cuenta.js  # Registration + OTP modal
│   │   ├── iniciar-sesion.js     # Login + password reset
│   │   ├── verificar-codigo.js     # OTP verification
│   │   ├── comprar-sats.js        # Purchase flow
│   │   ├── mi-espacio.js         # Profile management
│   │   ├── api.js                # API client
│   │   └── bitcoin-animation.js   # Blockchain visualization
│   ├── css/                      # Stylesheets
│   ├── img/                      # Images and icons
│   └── locales/                  # Translation files
│       ├── en/translation.json
│       ├── es/translation.json
│       ├── fr/translation.json
│       └── pt/translation.json
├── backend/
│   └── server.js                  # Express API server
├── package.json
├── README.md
├── AGENTS.md                      # AI agent guidance
└── CLAUDE.md                      # Claude AI instructions
```

## 🛠 Development

### Frontend Architecture

The frontend uses vanilla JavaScript with these patterns:

**State Management**
```javascript
const state = {
  form: { name: '', email: '', password: '' },
  lang: localStorage.getItem('lang') || 'es'
};
```

**Translation Usage**
```html
<!-- In HTML -->
<span data-i18n="welcome">Welcome</span>
```

```javascript
// In JavaScript
t('welcome');  // Returns translated string
```

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `flash_user` | JSON | User profile: `{name, email, password, whatsapp, country, verified}` |
| `pending_user_email` | String | Email awaiting verification |
| `pending_otp` | String | Current 6-digit OTP code |
| `pending_otp_expires` | Number | OTP expiration timestamp (15 min) |
| `token` | String | Authentication token |
| `userName` | String | Display name |
| `userEmail` | String | User email |
| `lang` | String | Selected language code (en/es/fr/pt) |

### OTP Flow

```
1. User fills registration form
2. Click "Crear cuenta" → OTP generated
3. Modal displays OTP code (e.g., 584729)
4. User enters code on verification page
5. Code validated against localStorage
6. User marked as verified → redirect to login
```

### Adding Translations

1. Edit `public/locales/{lang}/translation.json`
2. Add key-value pair: `"new_key": "Translated Value"`
3. Use in HTML: `data-i18n="new_key"`
4. Use in JS: `t('new_key')`

### Adding New Pages

1. Create `public/html/{page-name}.html`
2. Include CSS and JS:
```html
<link rel="stylesheet" href="../css/your-styles.css"/>
<script src="../js/your-script.js"></script>
```
3. Add translation keys for all text

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/verify-otp` | Verify OTP code |
| POST | `/api/v1/auth/regenerate-otp` | Request new OTP |
| POST | `/api/v1/auth/request-password-reset` | Password reset |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/logout` | User logout |

### Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/transactions` | List user transactions |
| POST | `/api/v1/transactions/create` | Create transaction |
| GET | `/api/v1/transactions/:id` | Get transaction details |
| GET | `/api/v1/transactions/resume` | Transaction summary |
| GET | `/api/v1/transactions/remaining` | Remaining allowance |

### API Request/Response Examples

**Register**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "password_confirmation": "securepass123",
  "whatsapp": "+22997970000",
  "country": "BJ"
}
```

**Login**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001

# JWT Configuration  
JWT_SECRET=your-super-secret-key-change-in-production

# Optional: Production API URL
# API_BASE=https://api.bitcoinflash.xyz
```

### Backend CORS Configuration

The backend is configured to accept requests from:
- `localhost:3000` (development)
- `localhost:3001` (backend itself)
- Any origin in development mode

For production, update the CORS configuration in `backend/server.js`.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Registration flow with OTP verification
- [ ] Login with created credentials
- [ ] Password reset functionality
- [ ] Profile editing (name, phone, country)
- [ ] Email field remains read-only
- [ ] Language switching persists
- [ ] Mobile responsive on various devices
- [ ] Bitcoin purchase flow

### Browser Console Debugging

Open DevTools (F12) and check Console for:

| Log Prefix | Purpose |
|------------|---------|
| `[API]` | API request/response debugging |
| `[REGISTER]` | Registration OTP generation |
| `[OTP]` | Verification status |
| `[AUTH]` | Authentication events |

### Test Accounts

For local development without backend:
```bash
Email: test@test.com
Password: password123
```

Or register a new account through the UI.

## 🚀 Deployment

### Frontend Deployment

The frontend is a static site deployable to:

| Service | Instructions |
|---------|--------------|
| **GitHub Pages** | Push to `gh-pages` branch |
| **Netlify** | Connect repo, deploy automatically |
| **Vercel** | Import project, deploy |
| **AWS S3** | Upload `public/` folder to S3 bucket |

### Backend Deployment

For production backend:

1. Set up Node.js environment (Ubuntu/Docker)
2. Configure environment variables:
   ```bash
   export PORT=3001
   export JWT_SECRET=production-secret
   ```
3. Replace in-memory storage with database (MongoDB/PostgreSQL)
4. Set up proper CORS origins
5. Configure Nginx/Apache with HTTPS
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name flash-api
   ```

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-new-feature
```

### Commit Message Convention

| Type | Description |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `style:` | Formatting, no code change |
| `refactor:` | Code refactoring |
| `test:` | Adding tests |
| `chore:` | Maintenance |

### Pull Request Process

1. Fork the repository
2. Create feature branch from `main`
3. Make atomic, well-described commits
4. Push and create Pull Request
5. Address review feedback
6. Squash and merge when approved

## 📄 License

Private project - All rights reserved

## 🔗 Useful Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) - API routing
- [Node.js Docs](https://nodejs.org/docs/latest/) - Server-side JavaScript
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Lightning Network](https://lightning.network/) - Second layer protocol

---

**Built with ⚡ for Africa**
