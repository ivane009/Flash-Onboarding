# Flash Onboarding

A modern, multilingual Bitcoin onboarding platform designed for the African market, built with React and i18next for internationalization.

## Project Overview

Flash is a web application that guides new users through the process of creating a Bitcoin wallet and purchasing their first sats via Lightning Network. The platform is optimized for mobile money integration across West Africa, supporting multiple languages and currencies.

## Architecture

### Tech Stack

- **Frontend Framework**: React 19 with Create React App
- **Internationalization**: i18next + react-i18next
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: react-scripts (webpack under the hood)
- **Testing**: Jest + React Testing Library

### Project Structure

```
flash-onboarding/
├── public/
│   ├── landing.html          # Landing page HTML
│   ├── landing.css          # Landing page styles
│   ├── landing.js           # Landing page JavaScript
│   ├── bitcoin-animation.js # Animated Bitcoin widget
│   ├── index.html          # React app entry point
│   ├── manifest.json       # PWA manifest
│   ├── flash.png           # App logo
│   ├── img/                # Images and icons
│   │   ├── create.png      # Step 1 illustration
│   │   ├── sesion.png      # Step 2 illustration
│   │   ├── buy.png         # Step 3 illustration
│   │   ├── confir.png       # Step 4 illustration
│   │   ├── mining.png       # Feature: Mining
│   │   ├── No Borders.png   # Feature: Borderless
│   │   ├── Frictionless Payments.png
│   │   └── Lightning Network.png
│   └── locales/            # Translation files
│       ├── en/translation.json
│       ├── es/translation.json
│       ├── fr/translation.json
│       └── pt/translation.json
├── src/
│   ├── App.js              # Main React application
│   ├── styles.css          # App-wide styles
│   ├── utils/              # Utility functions
│   └── [React components]
├── build/                  # Production build output
└── package.json
```

### Key Features

1. **Multilingual Support**: 4 languages (English, Spanish, French, Portuguese)
2. **Responsive Design**: Mobile-first approach with CSS custom properties
3. **Animated Elements**: SVG-based path animations, Bitcoin price ticker
4. **PWA Ready**: Manifest and service worker configuration
5. **Mobile Money Integration**: Support for MTN MoMo, Moov Money, Celtiis, Togocel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ivane009/Flash-Onboarding.git
cd Flash-Onboarding

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

Production files will be generated in the `build/` directory.

## Development

### Adding Translations

Translation files are located in `public/locales/{lang}/translation.json`. Each key-value pair corresponds to a `data-i18n` attribute in the HTML.

**Example:**

```json
{
  "hero_title": "Buy Bitcoin starting<br>at 100 FCFA !",
  "hero_cta": "Get Started"
}
```

```html
<h1 data-i18n="hero_title">Buy Bitcoin starting<br>at 100 FCFA !</h1>
<button data-i18n="hero_cta">Get Started</button>
```

To add a new language:
1. Create `public/locales/{code}/translation.json`
2. Copy structure from existing translation file
3. Translate all values
4. Add language option to language selector in `landing.html`

### Adding New Sections

1. Add HTML structure in `landing.html`
2. Add corresponding CSS in `landing.css`
3. If interactive, add JavaScript in `landing.js`
4. Add translation keys for all text content

### Styling Conventions

- CSS Variables defined in `:root` for theming
- BEM-like naming for component classes
- Mobile-first responsive breakpoints

## Git Workflow

### Branch Naming

- `main` - Production-ready code
- Feature branches: `feature/description` or `fix/description`

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add new feature`
- `fix: resolve issue with component`
- `docs: update documentation`
- `style: adjust styling`
- `refactor: restructure code`

### Pull Requests

1. Create feature branch from `main`
2. Make changes with clear commits
3. Push and create PR
4. Require review before merging

## Environment

The project uses React environment variables. For Create React App, prefix variables with `REACT_APP_`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

Private project - All rights reserved

## Resources

- [React Documentation](https://react.dev)
- [i18next Documentation](https://www.i18next.com/)
- [Create React App Docs](https://create-react-app.dev/)
- [Lightning Network Info](https://lightning.network/)
