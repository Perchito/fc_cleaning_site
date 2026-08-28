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

    document.body.style.opacity = '1';

    // Kick off Motion One animations after DOM is fully populated
    if (typeof initMotionAnimations === 'function') initMotionAnimations();

  } catch (err) {
    console.error('Includes failed:', err);
    document.body.style.opacity = '1';
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
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Debounced resize — avoids spamming reflows on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900) closeMenu();
    }, 120);
  }, { passive: true });
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
  let rafId = null;

  const saved = localStorage.getItem('quoteTabTop');
  if (saved) currentTop = parseFloat(saved);

  function getHeaderBottom() {
    const header = document.querySelector('.site-header');
    return header ? header.getBoundingClientRect().bottom : 82;
  }

  function applyPosition() {
    const headerBottom = getHeaderBottom();
    const tabH = tab.offsetHeight;
    const half = tabH / 2;
    const minTop = headerBottom + half + 12;
    const maxTop = window.innerHeight - half - 12;
    currentTop = Math.max(minTop, Math.min(maxTop, currentTop));
    tab.style.top = currentTop + 'px';
  }

  applyPosition();

  tab.addEventListener('touchstart', (e) => {
    isDragging = true;
    moved = false;
    startY = e.touches[0].clientY;
    if (rafId) cancelAnimationFrame(rafId);
  }, { passive: true });

  tab.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const moveY = e.touches[0].clientY;
    const delta = moveY - startY;
    if (Math.abs(delta) > 3) moved = true;
    currentTop += delta;
    startY = moveY;
    rafId = requestAnimationFrame(applyPosition);
    e.preventDefault();
  }, { passive: false });

  tab.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    localStorage.setItem('quoteTabTop', currentTop);
  }, { passive: true });

  tab.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); moved = false; }
  });

  let resizeTicking = false;
  window.addEventListener('resize', () => {
    if (!resizeTicking) {
      resizeTicking = true;
      requestAnimationFrame(() => {
        applyPosition();
        resizeTicking = false;
      });
    }
  }, { passive: true });
}

// ===== HEADER SCROLL EFFECT =====
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      const header = document.querySelector('.site-header');
      if (header) header.classList.toggle('scrolled', window.scrollY > 20);
      scrollTicking = false;
    });
  }
}, { passive: true });

// ===== INIT =====
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.15s ease';

document.addEventListener('DOMContentLoaded', () => {
  initFaviconSwitcher();
  loadIncludes();
});
