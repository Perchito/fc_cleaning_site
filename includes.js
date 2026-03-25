async function loadInclude(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const resp = await fetch(file);
    if (!resp.ok) throw new Error(resp.statusText);
    const html = await resp.text();
    el.innerHTML = html;
  } catch (err) {
    console.error('Include failed:', file, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadInclude('site-header', 'header.html');
  loadInclude('site-footer', 'footer.html');
  
  // Menu toggle script (runs after header loads)
  setTimeout(() => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (toggle && nav) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('is-open');
        nav.classList.toggle('is-open');
      });
    } else {
      console.log('Menu elements not found');
    }
  }, 100);
});
