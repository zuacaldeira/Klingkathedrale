// ═══════════════════════════════════════════════════════
// Klangkathedrale – Breadcrumb Navigation
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

export function findCurrentSection(currentPage) {
  for (const section of NAV_SECTIONS) {
    for (const page of section.pages) {
      if (page.href === currentPage) return section;
    }
  }
  return null;
}

export function findCurrentPageTitle(currentPage) {
  for (const section of NAV_SECTIONS) {
    for (const page of section.pages) {
      if (page.href === currentPage) return page.title;
    }
  }
  if (currentPage === 'architektur.html') return 'Architektur';
  return null;
}

export function createDropdown(section, currentPage) {
  const wrapper = document.createElement('span');
  wrapper.className = 'kk-bc-dropdown';

  const trigger = document.createElement('button');
  trigger.className = 'kk-bc-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.textContent = section.label + ' \u25BE';
  wrapper.appendChild(trigger);

  const menu = document.createElement('ul');
  menu.className = 'kk-bc-menu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;

  for (const page of section.pages) {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');
    if (page.href === currentPage) {
      const span = document.createElement('span');
      span.className = 'kk-bc-menu-item kk-bc-menu-active';
      span.setAttribute('role', 'menuitem');
      span.setAttribute('aria-current', 'page');
      span.textContent = page.title;
      li.appendChild(span);
    } else {
      const a = document.createElement('a');
      a.href = page.href;
      a.className = 'kk-bc-menu-item';
      a.setAttribute('role', 'menuitem');
      a.textContent = page.title;
      li.appendChild(a);
    }
    menu.appendChild(li);
  }

  wrapper.appendChild(menu);
  return wrapper;
}

export function toggleDropdown(wrapper) {
  const trigger = wrapper.querySelector('.kk-bc-trigger');
  const menu = wrapper.querySelector('.kk-bc-menu');
  const isOpen = !menu.hidden;
  menu.hidden = isOpen;
  trigger.setAttribute('aria-expanded', String(!isOpen));
}

export function closeAllDropdowns(bar) {
  const wrappers = bar.querySelectorAll('.kk-bc-dropdown');
  for (const w of wrappers) {
    const menu = w.querySelector('.kk-bc-menu');
    const trigger = w.querySelector('.kk-bc-trigger');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
}

export function createBreadcrumb(currentPage) {
  const bar = document.createElement('nav');
  bar.className = 'kk-bc-bar';
  bar.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'kk-bc-list';

  const isHub = currentPage === 'klangkathedrale.html';
  const isArchitektur = currentPage === 'architektur.html';
  const section = findCurrentSection(currentPage);
  const pageTitle = findCurrentPageTitle(currentPage);

  // First crumb: Klangkathedrale
  const homeLi = document.createElement('li');
  homeLi.className = 'kk-bc-item';
  if (isHub) {
    const span = document.createElement('span');
    span.className = 'kk-bc-current';
    span.setAttribute('aria-current', 'page');
    span.textContent = 'Klangkathedrale';
    homeLi.appendChild(span);
  } else {
    const a = document.createElement('a');
    a.href = 'klangkathedrale.html';
    a.className = 'kk-bc-link';
    a.textContent = 'Klangkathedrale';
    homeLi.appendChild(a);
  }
  ol.appendChild(homeLi);

  // Section dropdown (if page is in a section)
  if (section) {
    const sectionLi = document.createElement('li');
    sectionLi.className = 'kk-bc-item';
    const dropdown = createDropdown(section, currentPage);
    sectionLi.appendChild(dropdown);
    ol.appendChild(sectionLi);

    // Current page name
    const pageLi = document.createElement('li');
    pageLi.className = 'kk-bc-item';
    const pageSpan = document.createElement('span');
    pageSpan.className = 'kk-bc-current';
    pageSpan.setAttribute('aria-current', 'page');
    pageSpan.textContent = pageTitle;
    pageLi.appendChild(pageSpan);
    ol.appendChild(pageLi);
  }

  // Architektur (standalone, no dropdown)
  if (isArchitektur) {
    const archLi = document.createElement('li');
    archLi.className = 'kk-bc-item';
    const archSpan = document.createElement('span');
    archSpan.className = 'kk-bc-current';
    archSpan.setAttribute('aria-current', 'page');
    archSpan.textContent = 'Architektur';
    archLi.appendChild(archSpan);
    ol.appendChild(archLi);
  }

  bar.appendChild(ol);

  // Event: toggle dropdown on trigger click
  bar.addEventListener('click', (e) => {
    const trigger = e.target.closest('.kk-bc-trigger');
    if (trigger) {
      const wrapper = trigger.closest('.kk-bc-dropdown');
      toggleDropdown(wrapper);
      return;
    }
    // Click outside dropdown closes it
    closeAllDropdowns(bar);
  });

  // Event: Escape closes dropdown
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(bar);
    }
  });

  return bar;
}

export function injectStyles() {
  if (document.getElementById('kk-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'kk-nav-styles';
  style.textContent = `
.kk-bc-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: rgba(26,20,16,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201,168,76,0.3);
  z-index: 10000;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 0.9rem;
}
.kk-bc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0;
}
.kk-bc-item {
  display: flex;
  align-items: center;
}
.kk-bc-item:not(:first-child)::before {
  content: '\\203A';
  color: rgba(201,168,76,0.5);
  margin: 0 0.5rem;
  font-size: 1.1rem;
}
.kk-bc-link {
  color: rgba(201,168,76,0.9);
  text-decoration: none;
  transition: color 0.2s;
}
.kk-bc-link:hover, .kk-bc-link:focus-visible {
  color: rgba(201,168,76,1);
  outline: none;
}
.kk-bc-current {
  color: rgba(255,255,255,0.9);
}
.kk-bc-dropdown {
  position: relative;
}
.kk-bc-trigger {
  background: none;
  border: none;
  color: rgba(201,168,76,0.9);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 0.25rem 0.4rem;
  border-radius: 3px;
  transition: background 0.2s;
}
.kk-bc-trigger:hover, .kk-bc-trigger:focus-visible {
  background: rgba(201,168,76,0.12);
  outline: none;
}
.kk-bc-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 160px;
  background: rgba(26,20,16,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 6px;
  padding: 0.35rem 0;
  margin: 0;
  list-style: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.kk-bc-menu-item {
  display: block;
  padding: 0.45rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.88rem;
  transition: background 0.15s, color 0.15s;
}
a.kk-bc-menu-item:hover, a.kk-bc-menu-item:focus-visible {
  background: rgba(201,168,76,0.12);
  color: rgba(201,168,76,0.95);
  outline: none;
}
.kk-bc-menu-active {
  color: rgba(201,168,76,0.9);
  font-weight: 600;
}
@media (prefers-reduced-motion: reduce) {
  .kk-bc-link,
  .kk-bc-trigger,
  .kk-bc-menu-item {
    transition: none;
  }
}
`;
  document.head.appendChild(style);
}

function init() {
  if (typeof document === 'undefined') return;
  const page = getCurrentPage();
  if (page === 'index.html') return;

  injectStyles();
  const bar = createBreadcrumb(page);
  document.body.appendChild(bar);

  // Close dropdown on click outside the bar
  document.addEventListener('click', (e) => {
    if (!bar.contains(e.target)) {
      closeAllDropdowns(bar);
    }
  });
}

init();
