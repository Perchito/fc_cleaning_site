// NEW: Faster parallel header/footer loading
async function loadIncludes() {
  try {
    // Preload header for above-fold priority
    const headerPreload = document.createElement('link');
    headerPreload.rel = 'preload';
    headerPreload.href = 'header.html';
    headerPreload.as = 'fetch';
    document.head.appendChild(headerPreload);

    // Load header + footer SIMULTANEOUSLY (not one after the other)
    const [headerResp, footerResp] = await Promise.all([
      fetch('header.html'),
      fetch('footer.html')
    ]);

    if (!headerResp.ok) throw new Error('Header failed');
    if (!footerResp.ok) throw new Error('Footer failed');

    document.getElementById('site-header').innerHTML = await headerResp.text();
    document.getElementById('site-footer').innerHTML = await footerResp.text();

    // Run your mobile menu AFTER content loads
    initMobileMenu();
  } catch (err) {
    console.error('Includes failed:', err);
  }
}

// ===== ALL YOUR EXISTING FUNCTIONS (unchanged) =====
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
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

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

function initDraggableQuoteTab() {
  const tab = document.querySelector('.mobile-quote-tab');
  if (!tab) return;

  let isDragging = false;
  let moved = false;
  let startY = 0;
  let currentTop = window.innerHeight / 2;

  const saved = localStorage.getItem('quoteTabTop');
  if (saved) {
    currentTop = parseFloat(saved);
  }

  function applyPosition() {
    const minTop = 80;
    const maxTop = window.innerHeight - 80;
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

    if (Math.abs(delta) > 3) {
      moved = true;
    }

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
    if (moved) {
      e.preventDefault();
      moved = false;
    }
  });

  window.addEventListener('resize', applyPosition);
}

// ===== Scroll effect (unchanged) =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== UPDATED DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', async () => {
  initFaviconSwitcher();
  initDraggableQuoteTab();
  loadIncludes();  // Now FASTER parallel loading!
});