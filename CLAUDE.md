# Flash Onboarding - Agent Guidance

This document provides guidance for AI agents working on the Flash Onboarding project.

## Project Context

Flash is a Bitcoin onboarding platform for the African market. It allows users to:
- Create accounts with email verification
- Login with email/password
- Buy Bitcoin via Lightning Network
- Use Mobile Money for payments

## Technology Stack

- **Frontend**: Vanilla JavaScript (no framework), HTML, CSS
- **Backend**: Node.js with Express.js
- **Storage**: localStorage (frontend), in-memory (backend)
- **i18n**: Custom JSON-based translation system

## Key Files and Their Purposes

### Frontend Entry Points
- `public/index.html` - Landing page
- `public/html/crear-cuenta.html` - Registration
- `public/html/iniciar-sesion.html` - Login
- `public/html/verificar-codigo.html` - OTP verification
- `public/html/comprar-sats.html` - Purchase flow
- `public/html/mi-espacio.html` - User profile

### Core JavaScript Files
- `public/js/app-crear-cuenta.js` - Registration logic + OTP modal
- `public/js/iniciar-sesion.js` - Login logic + password reset
- `public/js/verificar-codigo.js` - OTP verification
- `public/js/api.js` - API client for backend communication

### Backend
- `backend/server.js` - Express API server with all endpoints

### Translation Files
- `public/locales/{lang}/translation.json` - Language strings

## Important Patterns

### localStorage Keys
```javascript
'flash_user'           // User object: {name, email, password, whatsapp, country, verified}
'pending_user_email'    // Email awaiting verification
'pending_otp'          // Current OTP code
'pending_otp_expires'  // OTP expiration timestamp
'token'                // Auth token
'userName'             // Display name
'userEmail'            // User email
'lang'                 // Selected language code
```

### OTP Flow
1. User registers → OTP generated and stored in localStorage
2. Modal displays OTP code for user to copy
3. User enters OTP on verification page
4. Code validated against localStorage
5. User marked as verified

### Translation Usage
```html
<span data-i18n="key_name">Default text</span>
```
```javascript
t('key_name')  // Returns translated string
```

## Common Tasks

### Adding a New Translation
1. Edit `public/locales/{lang}/translation.json`
2. Add `"new_key": "translated value"`
3. Use `data-i18n="new_key"` in HTML or `t('new_key')` in JS

### Modifying Registration Flow
Key function: `doRegister()` in `app-crear-cuenta.js`
- Validates form inputs
- Stores user in localStorage
- Generates OTP
- Shows verification modal

### Modifying Login Flow
Key function: `handleSubmit()` in `iniciar-sesion.js`
- Validates credentials against localStorage
- Sets auth token
- Redirects on success

## Architecture Decisions

### Why localStorage?
The project was designed to work WITHOUT a backend for development/testing. All user data, sessions, and verification codes are stored in the browser's localStorage.

### Why Vanilla JavaScript?
No build step required - files are served directly by any static file server.

### OTP as Display Code
For development simplicity, OTP is displayed on-screen rather than sent via email. This allows testing without email service configuration.

## Environment

- Node.js 18+ for backend
- npm for package management
- No build tools required for frontend
