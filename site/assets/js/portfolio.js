const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Back to top — fades out once the footer scrolls into view, instead of
// just tracking scroll position, so it never sits on top of footer
// content on short pages or overlaps the footer links near the bottom.
const toTop = document.querySelector('.to-top');
if (toTop) {
  const footer = document.querySelector('.site-footer');
  let pastThreshold = false;
  let footerVisible = false;
  const updateToTop = () => {
    toTop.classList.toggle('visible', pastThreshold && !footerVisible);
  };
  window.addEventListener('scroll', () => {
    pastThreshold = window.scrollY > 480;
    updateToTop();
  });
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      footerVisible = entries[0].isIntersecting;
      updateToTop();
    }, { rootMargin: '0px 0px -10% 0px' });
    footerObserver.observe(footer);
  }
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('nav.links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   RESEARCH / PROJECT PAGE PLUGINS
   Ported from the base file: heading anchors, code tabs, copy-
   to-clipboard on code blocks, Mermaid diagrams, and LaTeX-style
   pseudocode rendering. Math (KaTeX) is handled separately via
   auto-render, loaded per-page in katex-math.html.
   ============================================================ */

// ---- Heading anchors (adds a clickable # next to every h2/h3 in .research-body) ----
function initHeadingAnchors() {
  const headings = document.querySelectorAll('.research-body h2[id], .research-body h3[id]');
  headings.forEach(h => {
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'heading-anchor';
    a.setAttribute('aria-label', 'Link to this section');
    a.textContent = '#';
    h.appendChild(a);
  });
}

// ---- Code tabs (click / arrow-key switching between language panels) ----
function initCodeTabs() {
  document.querySelectorAll('.code-tabs').forEach(group => {
    const nav = group.querySelector('.code-tabs-nav');
    const buttons = Array.from(group.querySelectorAll('.code-tab-btn'));
    const panels = Array.from(group.querySelectorAll('.code-tabs-panel'));
    if (nav) nav.setAttribute('role', 'tablist');

    const activate = (btn, focus) => {
      const target = btn.dataset.tab;
      buttons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
        b.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panels.forEach(p => p.classList.toggle('active', p.dataset.tab === target));
      if (focus) btn.focus();
    };

    buttons.forEach((btn, i) => {
      const panel = panels[i];
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(btn.classList.contains('active')));
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
      if (panel) {
        if (!panel.id) panel.id = `${group.id || 'code-tabs'}-panel-${i}`;
        btn.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
      }

      btn.addEventListener('click', () => activate(btn, false));

      btn.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (i + 1) % buttons.length;
        else if (e.key === 'ArrowLeft') newIndex = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') newIndex = 0;
        else if (e.key === 'End') newIndex = buttons.length - 1;
        if (newIndex !== null) {
          e.preventDefault();
          activate(buttons[newIndex], true);
        }
      });
    });
  });
}

// ---- Copy button on code blocks (skips mermaid/pseudocode blocks, which render as diagrams/typeset boxes instead) ----
function initCodeCopy() {
  document.querySelectorAll('.research-body .highlighter-rouge:not(.language-mermaid):not(.language-pseudocode)').forEach(block => {
    const codeEl = block.querySelector('code');
    if (!codeEl) return;
    const btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
    btn.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(codeEl.textContent.trim());
        ok = true;
      } catch {
        try {
          const ta = document.createElement('textarea');
          ta.value = codeEl.textContent.trim();
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand('copy');
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }
      const original = btn.innerHTML;
      btn.classList.add(ok ? 'copied' : 'copy-failed');
      btn.innerHTML = ok
        ? '<i class="fa-solid fa-check"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
      if (!ok) btn.setAttribute('title', 'Copy failed — select the code manually');
      setTimeout(() => {
        btn.classList.remove('copied', 'copy-failed');
        btn.innerHTML = original;
      }, 1600);
    });
    block.style.position = 'relative';
    block.appendChild(btn);
  });
}

// ---- Mermaid diagrams (```mermaid fenced blocks -> rendered SVG) ----
function initMermaid() {
  const blocks = document.querySelectorAll('.research-body .language-mermaid');
  if (!blocks.length) return;

  const sources = [];
  blocks.forEach((block, i) => {
    const codeEl = block.tagName === 'CODE' ? block : block.querySelector('code');
    if (!codeEl) return;
    const container = block.tagName === 'CODE' ? (block.closest('pre') || block) : block;
    const holder = document.createElement('div');
    holder.className = 'mermaid-holder';
    holder.id = 'mermaid-diagram-' + i;
    container.replaceWith(holder);
    sources.push({ id: holder.id, src: codeEl.textContent });
  });
  if (!sources.length) return;

  import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs')
    .then(({ default: mermaid }) => {
      window.mermaidLib = mermaid;
      renderMermaidDiagrams(sources);
    })
    .catch(() => {
      sources.forEach(({ id }) => {
        const holder = document.getElementById(id);
        if (holder) holder.innerHTML = '<p class="mermaid-error">Diagram library failed to load — check your internet connection.</p>';
      });
    });
}

function renderMermaidDiagrams(sources) {
  if (!window.mermaidLib) return;
  // This site uses a single warm-paper theme (no dark mode), so Mermaid
  // always renders with its 'default' (light) theme.
  window.mermaidLib.initialize({
    startOnLoad: false, theme: 'base', securityLevel: 'loose', fontFamily: 'inherit',
    themeVariables: {
      fontSize: '19px', primaryColor: '#E1EBF3', primaryBorderColor: '#44688F',
      primaryTextColor: '#1F2D40', lineColor: '#587880', secondaryColor: '#EDF2F5', tertiaryColor: '#F8FAFB'
    },
    flowchart: { useMaxWidth: false, htmlLabels: true, padding: 18, nodeSpacing: 36, rankSpacing: 44, curve: 'basis' }
  });
  sources.forEach(async ({ id, src }) => {
    const holder = document.getElementById(id);
    if (!holder) return;
    try {
      const { svg } = await window.mermaidLib.render(id + '-svg', src);
      holder.innerHTML = svg;
    } catch {
      holder.innerHTML = '<p class="mermaid-error">Diagram failed to render — check the syntax.</p>';
    }
  });
}

// ---- Pseudocode (```pseudocode fenced blocks with LaTeX algorithmic syntax -> typeset algorithm box) ----
function initPseudocode() {
  const blocks = document.querySelectorAll('.research-body .language-pseudocode');
  if (!blocks.length) return;

  const pres = [];
  blocks.forEach((block, i) => {
    const codeEl = block.tagName === 'CODE' ? block : block.querySelector('code');
    if (!codeEl) return;
    const container = block.tagName === 'CODE' ? (block.closest('pre') || block) : block;
    const pre = document.createElement('pre');
    pre.id = 'pseudocode-' + i;
    pre.textContent = codeEl.textContent.replace(/\$\$/g, '$');
    container.replaceWith(pre);
    pres.push(pre);
  });
  if (!pres.length) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdn.jsdelivr.net/npm/pseudocode@2.4.1/build/pseudocode.min.css';
  document.head.appendChild(css);

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/pseudocode@2.4.1/build/pseudocode.min.js';
  script.onload = () => {
    pres.forEach(pre => {
      try {
        window.pseudocode.renderElement(pre, { lineNumber: true, lineNumberPunc: ':' });
      } catch {
        pre.textContent = 'Pseudocode failed to render — check the LaTeX syntax.';
      }
    });
  };
  document.head.appendChild(script);
}

/* ============================================================
   PUBLICATIONS — abstract toggle + BibTeX copy
   Ported from the base file's pub-list feature set.
   ============================================================ */

// ---- Abstract / Cite toggle buttons ----
function initAbstractToggles() {
  document.querySelectorAll('.abs-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      const isOpen = panel.classList.toggle('open');
      btn.classList.toggle('is-active', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

// ---- Copy BibTeX to clipboard ----
function initBibCopy() {
  document.querySelectorAll('.bib-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = (document.getElementById(btn.dataset.copyTarget)?.textContent || '').trim();
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand('copy');
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }
      const original = btn.innerHTML;
      btn.classList.add(ok ? 'copied' : 'copy-failed');
      btn.innerHTML = ok
        ? '<i class="fa-solid fa-check"></i> copied'
        : '<i class="fa-solid fa-xmark"></i> failed';
      setTimeout(() => { btn.classList.remove('copied', 'copy-failed'); btn.innerHTML = original; }, 1600);
    });
  });
}

initAbstractToggles();
initBibCopy();

/* ============================================================
   CV FLOATING SECTION NAV (cv page only — both functions no-op
   elsewhere since the elements they look for won't exist).
   ============================================================ */

// ---- Fade the rail in once scrolled past the page header, same cue as
// the "back to top" button. ----
function initCvDockVisibility() {
  const dock = document.getElementById('cvDock');
  if (!dock) return;
  const THRESHOLD = 420; // roughly past the CV page header
  const update = () => dock.classList.toggle('visible', window.scrollY > THRESHOLD);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ---- Highlight whichever CV section is currently in view — this is
// what lights up that section's icon and drives its hover tooltip. ----
function initCvDockActiveState() {
  const dockItems = document.querySelectorAll('.cv-dock-pill[data-section]');
  if (!dockItems.length) return;
  const sections = Array.from(dockItems)
    .map(i => document.getElementById(i.dataset.section))
    .filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeItem = Array.from(dockItems).find(i => i.dataset.section === entry.target.id);
        dockItems.forEach(i => i.classList.toggle('is-active', i === activeItem));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

// ---- Close button collapses the rail down to a small reopen handle in
// the same spot — the escape hatch for widths (like iPad's 820px) where
// the rail sits close enough to the text that someone may just want it
// out of the way. Choice persists across visits via localStorage so it
// doesn't reappear every time they come back to re-read the CV.
//
// The rail slides out toward the edge and fades as it closes, and the
// handle slides in from that same edge to take its place (reverse on
// open) — driven here rather than pure CSS because the rail needs to
// stay visible and in the DOM until its slide-out animation actually
// finishes; only then does display:none (via the .collapsed class)
// remove it and the handle's slide-in start. Without that sequencing
// the rail would just vanish mid-slide instead of completing the
// motion. ----
function initCvDockCollapse() {
  const dock = document.getElementById('cvDock');
  const closeBtn = document.getElementById('cvDockClose');
  const handle = document.getElementById('cvDockHandle');
  const rail = document.getElementById('cvDockRail');
  if (!dock || !closeBtn || !handle || !rail) return;
  const STORE_KEY = 'cvDockCollapsed';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pendingCloseHandler = null; // guards against open() firing mid-close-animation

  const playIn = (el) => {
    el.classList.remove('slide-out');
    el.classList.remove('slide-in');
    void el.offsetWidth; // force reflow so the animation restarts even on rapid re-clicks
    el.classList.add('slide-in');
  };

  const close = () => {
    handle.hidden = true;
    if (reduceMotion) {
      dock.classList.add('collapsed');
      handle.hidden = false;
      return;
    }
    rail.classList.remove('slide-in');
    rail.classList.add('slide-out');
    const onEnd = () => {
      pendingCloseHandler = null;
      rail.removeEventListener('animationend', onEnd);
      rail.classList.remove('slide-out');
      dock.classList.add('collapsed');
      handle.hidden = false;
      playIn(handle);
    };
    pendingCloseHandler = onEnd;
    rail.addEventListener('animationend', onEnd);
  };

  const open = () => {
    if (pendingCloseHandler) { // cancel an in-flight close if reopened mid-animation
      rail.removeEventListener('animationend', pendingCloseHandler);
      pendingCloseHandler = null;
    }
    dock.classList.remove('collapsed');
    handle.hidden = true;
    if (reduceMotion) return;
    playIn(rail);
  };

  const setCollapsed = (collapsed, { animate = true } = {}) => {
    if (!animate) {
      dock.classList.toggle('collapsed', collapsed);
      handle.hidden = !collapsed;
    } else if (collapsed) {
      close();
    } else {
      open();
    }
    try { localStorage.setItem(STORE_KEY, collapsed ? '1' : '0'); } catch (e) { /* storage unavailable */ }
  };

  let saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* storage unavailable */ }
  setCollapsed(saved === '1', { animate: false }); // no animation on initial page load

  closeBtn.addEventListener('click', () => setCollapsed(true));
  handle.addEventListener('click', () => setCollapsed(false));
}

initCvDockVisibility();
initCvDockActiveState();
initCvDockCollapse();

initHeadingAnchors();
initCodeTabs();
initCodeCopy();
initMermaid();
initPseudocode();
