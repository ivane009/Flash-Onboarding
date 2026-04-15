import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const EyeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12 C 5 -4, 19 -4, 23 12 C 19 20, 5 20, 1 12 Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 6l-10 7L2 6"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ZapIcon = () => (
  <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

export function IniciarSesionForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'fr');
  const langDropdownRef = React.useRef(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.password) newErrors.password = 'Requerido';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast('Llena todos los campos');
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
      <nav className="w-full bg-[#0d1b2a]/90 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <img src="/flash.png" alt="Flash" className="h-9 w-9" />
              <span className="text-xl font-bold text-white tracking-tight">Flash</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-all"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:inline">Retour</span>
            </button>

            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-all"
              >
                <GlobeIcon />
                <span className="font-medium">{currentLang.label}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-[100] animate-dropdownIn">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLang(language.code);
                        setShowLangDropdown(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                        lang === language.code
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-300 hover:bg-slate-700'
                      )}
                    >
                      <span className="font-medium">{language.label}</span>
                      <span className="text-slate-500">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={`flex-1 flex items-center justify-center p-4 md:p-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <div className="w-full max-w-5xl">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/30 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-cyan-900/30 to-slate-900/50 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-700/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <ZapIcon />
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">Flash</span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                  L'accès au Bitcoin n'a jamais été aussi simple !
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Achetez puis vendez des Sats en toute sécurité à un prix compétitif.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <ShieldIcon />
                    </div>
                    <span className="text-sm text-slate-300">100% sécurisé et protégé</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <ZapIcon />
                    </div>
                    <span className="text-sm text-slate-300">Transaction instantanée</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    <span className="text-sm text-slate-300">Sans commission cachée</span>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-black">1</span>
                    <span className="text-xs font-medium text-white">Tu cuenta</span>
                  </div>
                  <div className="flex-1 h-px bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-medium text-slate-500">2</span>
                    <span className="text-xs text-slate-500">Vérification</span>
                  </div>
                  <div className="flex-1 h-px bg-slate-700/50" />
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-medium text-slate-500">3</span>
                    <span className="text-xs text-slate-500">Acheter</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="text-xs font-medium leading-none text-slate-400 mb-2 block">Adresse e-mail</label>
                    <div className="relative">
                      <MailIcon />
                      <input
                        type="email"
                        placeholder="kofi@example.com"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={cn(
                          'flex h-10 w-full rounded-lg border bg-slate-800/80 pl-11 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200',
                          errors.email ? 'border-red-500' : 'border-slate-600/50'
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5 animate-errorIn">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium leading-none text-slate-400 mb-2 block">Mot de passe</label>
                    <div className="relative">
                      <LockIcon />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 caractères"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={cn(
                          'flex h-10 w-full rounded-lg border bg-slate-800/80 pl-11 pr-11 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200',
                          errors.password ? 'border-red-500' : 'border-slate-600/50'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1.5 animate-errorIn">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <span>Se connecter</span>
                        <ArrowRightIcon />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                  Vous n'avez pas de compte?{' '}
                  <a href="/html/crear-cuenta.html" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                    Créer un compte
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[200] animate-toastIn">
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-dropdownIn { animation: dropdownIn 0.2s ease-out; }
        .animate-errorIn { animation: errorIn 0.2s ease-out; }
        .animate-toastIn { animation: toastIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}