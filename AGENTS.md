# AGENTS.md - Flash Onboarding

## Project Overview

Flash is a Bitcoin onboarding platform for the African market, allowing users to create accounts, verify via OTP, and purchase Bitcoin via Lightning Network with Mobile Money integration.

## Quick Start

```bash
npm install
npm start          # Frontend only at http://localhost:3000
npm run server     # Backend only at http://localhost:3001
```

## Key Technologies

- **Frontend**: Vanilla JavaScript (no framework), HTML5, CSS3
- **Backend**: Node.js + Express.js
- **Storage**: Browser localStorage (frontend), in-memory (backend)
- **i18n**: Custom JSON-based system in `public/locales/`

## Important File Locations

| Purpose | File |
|---------|------|
| Landing Page | `public/index.html` |
| Registration | `public/html/crear-cuenta.html` |
| Registration Logic | `public/js/app-crear-cuenta.js` |
| Login | `public/html/iniciar-sesion.html` |
| Login Logic | `public/js/iniciar-sesion.js` |
| OTP Verification | `public/js/verificar-codigo.js` |
| API Client | `public/js/api.js` |
| Backend Server | `backend/server.js` |

## Common Patterns

### localStorage Keys
- `flash_user` - User profile data
- `pending_otp` - Current OTP code
- `token` - Authentication token
- `lang` - Language preference

### Translation
```javascript
// In HTML
<span data-i18n="key">Default</span>

// In JavaScript
t('key')
```

## Development Notes

- Frontend works standalone with localStorage
- Backend provides REST API for production
- OTP displays on screen for development (no email service)
- All pages are responsive and mobile-first
- Supports 4 languages: EN, ES, FR, PT

## Scripts

```bash
npm start      # Start frontend (port 3000)
npm run server # Start backend (port 3001)
npm run dev    # Both concurrently
```
