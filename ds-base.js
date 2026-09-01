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
})();
