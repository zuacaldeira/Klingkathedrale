// ═══════════════════════════════════════════════════════
// Klangkathedrale – Hybrid Overlay Navigation
// ═══════════════════════════════════════════════════════

export const NAV_SECTIONS = [
  {
    label: 'Erleben',
    pages: [
      { href: 'orgel.html', title: 'Orgel' },
      { href: 'kathedrale.html', title: 'Kathedrale' },
      { href: 'fugenmaschine.html', title: 'Fugenmaschine' },
      { href: 'partitur.html', title: 'Partitur' }
    ]
  },
  {
    label: 'Entdecken',
    pages: [
      { href: 'entdecke-bach.html', title: 'Entdecke Bach' },
      { href: 'weltkarte.html', title: 'Weltkarte' },
      { href: 'universum.html', title: 'Universum' },
      { href: 'infografik.html', title: 'Infografik' }
    ]
  },
  {
    label: 'Erinnern',
    pages: [
      { href: 'brief.html', title: 'Brief' },
      { href: 'stimmen.html', title: 'Stimmen' },
      { href: 'netzwerk.html', title: 'Netzwerk' }
    ]
  }
];

export function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  if (file === '' || file === 'index.html') return 'klangkathedrale.html';
  return file;
}

export function createNavButton() {
  const btn = document.createElement('button');
  btn.className = 'kk-nav-btn';
  btn.setAttribute('aria-label', 'Navigation öffnen');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'kk-nav-overlay');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  return btn;
}

export function createNavOverlay(currentPage) {
  const overlay = document.createElement('div');
  overlay.id = 'kk-nav-overlay';
  overlay.className = 'kk-nav-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Seitennavigation');
  overlay.hidden = true;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'kk-nav-close';
  closeBtn.setAttribute('aria-label', 'Navigation schließen');
  closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const nav = document.createElement('nav');
  nav.className = 'kk-nav-content';

  // Hub link
  const hubLink = document.createElement('a');
  hubLink.href = 'klangkathedrale.html';
  hubLink.className = 'kk-nav-hub';
  hubLink.textContent = 'Klangkathedrale';
  if (currentPage === 'klangkathedrale.html') {
    hubLink.setAttribute('aria-current', 'page');
  }
  nav.appendChild(hubLink);

  // Sections
  for (const section of NAV_SECTIONS) {
    const heading = document.createElement('h2');
    heading.className = 'kk-nav-heading';
    heading.textContent = section.label;
    nav.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'kk-nav-list';
    for (const page of section.pages) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = page.href;
      a.textContent = page.title;
      a.className = 'kk-nav-link';
      if (currentPage === page.href) {
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
      list.appendChild(li);
    }
    nav.appendChild(list);
  }

  // Footer link
  const footer = document.createElement('div');
  footer.className = 'kk-nav-footer';
  const archLink = document.createElement('a');
  archLink.href = 'architektur.html';
  archLink.className = 'kk-nav-footer-link';
  archLink.textContent = 'Architektur';
  if (currentPage === 'architektur.html') {
    archLink.setAttribute('aria-current', 'page');
  }
  footer.appendChild(archLink);
  nav.appendChild(footer);

  overlay.appendChild(closeBtn);
  overlay.appendChild(nav);
  return overlay;
}

export function injectStyles() {
  if (document.getElementById('kk-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'kk-nav-styles';
  style.textContent = `
.kk-nav-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(26,20,16,0.8);
  border: 1px solid rgba(201,168,76,0.3);
  color: rgba(201,168,76,0.9);
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: border-color 0.2s, background 0.2s;
}
.kk-nav-btn:hover, .kk-nav-btn:focus-visible {
  border-color: rgba(201,168,76,0.7);
  background: rgba(26,20,16,0.95);
  outline: none;
}
.kk-nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(26,20,16,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.kk-nav-overlay:not([hidden]) {
  opacity: 1;
}
.kk-nav-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(201,168,76,0.3);
  color: rgba(201,168,76,0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.kk-nav-close:hover, .kk-nav-close:focus-visible {
  border-color: rgba(201,168,76,0.7);
  outline: none;
}
.kk-nav-content {
  text-align: center;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem;
}
.kk-nav-hub {
  display: inline-block;
  font-size: 1.5rem;
  color: rgba(201,168,76,0.9);
  text-decoration: none;
  margin-bottom: 2rem;
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: 0.05em;
}
.kk-nav-hub:hover {
  color: rgba(201,168,76,1);
}
.kk-nav-hub[aria-current="page"] {
  border-bottom: 2px solid rgba(201,168,76,0.6);
  pointer-events: none;
}
.kk-nav-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(201,168,76,0.5);
  margin: 1.5rem 0 0.75rem;
  font-family: Georgia, 'Times New Roman', serif;
}
.kk-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.kk-nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s, color 0.2s;
}
.kk-nav-link:hover, .kk-nav-link:focus-visible {
  color: rgba(201,168,76,0.9);
  border-color: rgba(201,168,76,0.4);
  outline: none;
}
.kk-nav-link[aria-current="page"] {
  color: rgba(201,168,76,0.9);
  border-color: rgba(201,168,76,0.5);
  pointer-events: none;
}
.kk-nav-footer {
  margin-top: 2rem;
}
.kk-nav-footer-link {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
}
.kk-nav-footer-link:hover {
  color: rgba(255,255,255,0.7);
}
.kk-nav-footer-link[aria-current="page"] {
  color: rgba(201,168,76,0.6);
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .kk-nav-btn,
  .kk-nav-overlay,
  .kk-nav-link {
    transition: none;
  }
}
`;
  document.head.appendChild(style);
}

export function openNav(button, overlay) {
  overlay.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const closeBtn = overlay.querySelector('.kk-nav-close');
  if (closeBtn) closeBtn.focus();
}

export function closeNav(button, overlay) {
  overlay.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  button.focus();
}

export function trapFocus(overlay) {
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = overlay.querySelectorAll('button, a[href]');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function init() {
  if (typeof document === 'undefined') return;
  const page = getCurrentPage();
  if (page === 'index.html') return;

  injectStyles();
  const button = createNavButton();
  const overlay = createNavOverlay(page);

  document.body.appendChild(button);
  document.body.appendChild(overlay);

  trapFocus(overlay);

  button.addEventListener('click', () => openNav(button, overlay));

  const closeBtn = overlay.querySelector('.kk-nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeNav(button, overlay));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav(button, overlay);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) {
      closeNav(button, overlay);
    }
  });
}

init();
