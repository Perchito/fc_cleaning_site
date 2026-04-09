async function loadInclude(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const resp = await fetch(file);
  if (!resp.ok) throw new Error(`Failed to load ${file}`);
  el.innerHTML = await resp.text();
}

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

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadInclude('site-header', 'header.html');
    await loadInclude('site-footer', 'footer.html');
    initMobileMenu();
  } catch (err) {
    console.error('Include failed:', err);
  }
});