async function loadInclude(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const resp = await fetch(file);
  if (!resp.ok) throw new Error(`Failed to load ${file}`);
  el.innerHTML = await resp.text();
}

function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadInclude('site-header', 'header.html');
    await loadInclude('site-footer', 'footer.html');
    initMobileMenu();
  } catch (err) {
    console.error(err);
  }
});
