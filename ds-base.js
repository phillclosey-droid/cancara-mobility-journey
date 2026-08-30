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
})();
