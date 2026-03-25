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
});
