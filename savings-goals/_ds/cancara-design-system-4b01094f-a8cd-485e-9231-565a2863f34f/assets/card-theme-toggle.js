/* ============================================================
   Cancara — specimen-card theme toggle
   Adds a small Light/Dark button to a design-system card so you
   can preview the dark-mode mapping. Presentation aid for the
   cards only — not part of any component.
   ============================================================ */
(function () {
  function make() {
    var root = document.documentElement;
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "light");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle light or dark mode");

    Object.assign(btn.style, {
      position: "fixed",
      top: "var(--spacing-size12)",
      right: "var(--spacing-size12)",
      zIndex: "9999",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-size08)",
      fontFamily: "var(--type-style10-family)",
      fontSize: "var(--type-style10-size)",
      fontWeight: "var(--type-style10-weight)",
      lineHeight: "1",
      padding: "var(--spacing-size08) var(--spacing-size12)",
      borderRadius: "var(--radius-full)",
      border: "var(--border-width-01) solid var(--border-generic-default)",
      background: "var(--background-panel-default)",
      color: "var(--text-generic-default)",
      cursor: "pointer",
    });

    function refreshTokens() {
      // Re-read any token-value captions (cards stamp them with [data-of]).
      var cs = getComputedStyle(document.documentElement);
      document.querySelectorAll("[data-of]").forEach(function (el) {
        el.textContent = cs.getPropertyValue(el.getAttribute("data-of")).trim().toUpperCase();
      });
    }
    function paint() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.textContent = dark ? "☀  Light" : "☾  Dark";
    }
    btn.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark";
      root.setAttribute("data-theme", dark ? "light" : "dark");
      paint();
      refreshTokens();
    });
    paint();
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", make);
  } else {
    make();
  }
})();
