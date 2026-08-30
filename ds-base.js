// Loads the bound Cancara design system into every page of this journey.
// ONE line to edit: `base` points at the bound DS folder relative to this file.
(() => {
  const base = '_ds/cancara';
  // journey.css is the journey-page entry — it @imports styles.css (tokens, fonts,
  // base) plus layout.css + transitions.css (the assembly helpers). One link.
  for (const p of ["journey.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — point the base line at the bound _ds/<folder> tree relative to this page');
  document.head.appendChild(s);

  // Keep the browser / status-bar chrome matched to the page background, so no
  // stray brand-green band shows behind the phone status bar. Reads the resolved
  // --background-page-default token (dark in dark theme, light in light theme)
  // and writes it to <meta name="theme-color">. Re-runs when the theme toggles.
  function syncThemeColor() {
    try {
      if (!document.body) return;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;background:var(--background-page-default);pointer-events:none';
      document.body.appendChild(probe);
      const c = getComputedStyle(probe).backgroundColor;
      probe.remove();
      if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return;
      let m = document.querySelector('meta[name="theme-color"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'theme-color'); document.head.appendChild(m); }
      m.setAttribute('content', c);
    } catch (e) {}
  }
  function scheduleSync() { syncThemeColor(); setTimeout(syncThemeColor, 120); setTimeout(syncThemeColor, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleSync);
  else scheduleSync();
  try {
    new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();
