// Loads the bound Cancara design system into every page of this journey.
// ONE line to edit: `base` points at the bound DS folder relative to this file.
(() => {
  const scriptDir = document.currentScript.src.replace(/[^/]*$/, '');
  const base = scriptDir + '_ds/cancara';
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
  // The DS bundle injects a "Light/Dark" specimen-card toggle button (presentation aid
  // for design-system cards) on every page — journey pages don't want it.
  const hide = document.createElement('style');
  hide.textContent = 'button[aria-label="Toggle light or dark mode"] { display: none !important; }';
  document.head.appendChild(hide);

  // Robust mobile viewport height: some mobile browsers report 100dvh a beat late (or
  // inconsistently) around the address-bar show/hide transition, which can leave the
  // bottom nav laid out below the true visible area on first paint. Track the real
  // visible height in JS (falls back to 100dvh where unsupported) and keep it live on
  // resize/orientation/keyboard changes.
  const setAppHeight = () => {
    const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    document.documentElement.style.setProperty('--app-vh', h + 'px');
  };
  setAppHeight();
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', setAppHeight);

  // Match the browser / native status-bar chrome to the PAGE background token
  // (--background-page-default) so no stray brand-green band shows behind the native
  // status bar. Reads the resolved token for the current theme and writes it to
  // <meta name="theme-color">; re-runs when the theme is toggled.
  const syncThemeColor = () => {
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
  };
  const scheduleThemeColor = () => { syncThemeColor(); setTimeout(syncThemeColor, 120); setTimeout(syncThemeColor, 500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleThemeColor);
  else scheduleThemeColor();
  try {
    new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();
