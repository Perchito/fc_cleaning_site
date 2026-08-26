// Parallel header/footer loading with body-flash prevention
async function loadIncludes() {
  try {
    const [headerResp, footerResp] = await Promise.all([
      fetch('header.html'),
      fetch('footer.html')
    ]);

    if (!headerResp.ok) throw new Error('Header failed');
    if (!footerResp.ok) throw new Error('Footer failed');

    document.getElementById('site-header').innerHTML = await headerResp.text();
    document.getElementById('site-footer').innerHTML = await footerResp.text();

    initMobileMenu();
    initDraggableQuoteTab();

    // Reveal body smoothly once header/footer are in place
    document.body.style.opacity = '1';
  } catch (err) {
    console.error('Includes failed:', err);
    document.body.style.opacity = '1'; // always reveal even on error
  }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    nav.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('menu-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

// ===== FAVICON SWITCH =====
function initFaviconSwitcher() {
  const favicon = document.getElementById('favicon');
  if (!favicon) return;

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function updateFavicon() {
    favicon.href = darkModeQuery.matches
      ? 'images/company-logo/fc-logo-white-icon.png'
      : 'images/company-logo/fc-logo-black-icon.png';
  }

  updateFavicon();

  if (darkModeQuery.addEventListener) {
    darkModeQuery.addEventListener('change', updateFavicon);
  } else {
    darkModeQuery.addListener(updateFavicon);
  }
}

// ===== DRAGGABLE QUOTE TAB =====
function initDraggableQuoteTab() {
  const tab = document.querySelector('.mobile-quote-tab');
  if (!tab) return;

  let isDragging = false;
  let moved = false;
  let startY = 0;
  let currentTop = window.innerHeight / 2;

  const saved = localStorage.getItem('quoteTabTop');
  if (saved) currentTop = parseFloat(saved);

  function getHeaderBottom() {
    const header = document.querySelector('.site-header');
    if (!header) return 82;
    return header.getBoundingClientRect().bottom;
  }

  function getTabVisualHeight() {
    return tab.getBoundingClientRect().height;
  }

  function applyPosition() {
    const headerBottom = getHeaderBottom();
    const tabHalfHeight = getTabVisualHeight() / 2;
    const minTop = headerBottom + tabHalfHeight + 12;
    const maxTop = window.innerHeight - tabHalfHeight - 12;
    currentTop = Math.max(minTop, Math.min(maxTop, currentTop));
    tab.style.top = currentTop + 'px';
    tab.style.transform = 'translateY(-50%)';
  }

  applyPosition();

  tab.addEventListener('touchstart', (e) => {
    isDragging = true;
    moved = false;
    startY = e.touches[0].clientY;
  }, { passive: true });

  tab.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const moveY = e.touches[0].clientY;
    const delta = moveY - startY;
    if (Math.abs(delta) > 3) moved = true;
    currentTop += delta;
    startY = moveY;
    applyPosition();
    e.preventDefault();
  }, { passive: false });

  tab.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    localStorage.setItem('quoteTabTop', currentTop);
  });

  tab.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); moved = false; }
  });

  window.addEventListener('resize', applyPosition);
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== INIT =====
// Hide body immediately so header/footer fetch doesn't cause a visible layout jump
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.15s ease';

document.addEventListener('DOMContentLoaded', () => {
  initFaviconSwitcher();
  loadIncludes();
});
