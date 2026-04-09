window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  document.getElementById('progressBar').style.width = scrolled + '%';
});

const langSelector = document.querySelector('.lang-selector');
const langDropdown = document.getElementById('langDropdown');
const currentLangEl = document.getElementById('currentLang');

if (langSelector && langDropdown) {
  langSelector.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    langDropdown.classList.remove('active');
  });

  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      localStorage.setItem('lang', lang);
      loadTranslations(lang);
      if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
      langDropdown.classList.remove('active');
    });
  });
}