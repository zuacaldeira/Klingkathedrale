import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  NAV_SECTIONS,
  getCurrentPage,
  findCurrentSection,
  findCurrentPageTitle,
  createDropdown,
  toggleDropdown,
  closeAllDropdowns,
  createBreadcrumb,
  injectStyles
} from '../../src/lib/nav.js';

describe('nav', () => {
  beforeEach(() => {
    document.querySelector('.kk-bc-bar')?.remove();
    document.getElementById('kk-nav-styles')?.remove();
  });

  describe('NAV_SECTIONS', () => {
    it('has 3 sections', () => {
      expect(NAV_SECTIONS).toHaveLength(3);
    });

    it('has correct section labels', () => {
      const labels = NAV_SECTIONS.map(s => s.label);
      expect(labels).toEqual(['Erleben', 'Entdecken', 'Erinnern']);
    });

    it('contains 11 page links total', () => {
      const total = NAV_SECTIONS.reduce((sum, s) => sum + s.pages.length, 0);
      expect(total).toBe(11);
    });

    it('each page has href and title', () => {
      for (const section of NAV_SECTIONS) {
        for (const page of section.pages) {
          expect(page.href).toMatch(/\.html$/);
          expect(page.title).toBeTruthy();
        }
      }
    });
  });

  describe('getCurrentPage()', () => {
    it('extracts filename from pathname', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/orgel.html' }, writable: true
      });
      expect(getCurrentPage()).toBe('orgel.html');
    });

    it('maps empty path to klangkathedrale.html', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' }, writable: true
      });
      expect(getCurrentPage()).toBe('klangkathedrale.html');
    });

    it('maps index.html to klangkathedrale.html', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/index.html' }, writable: true
      });
      expect(getCurrentPage()).toBe('klangkathedrale.html');
    });

    it('handles nested paths', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/sub/path/fugenmaschine.html' }, writable: true
      });
      expect(getCurrentPage()).toBe('fugenmaschine.html');
    });
  });

  describe('findCurrentSection()', () => {
    it('returns section for a page in Erleben', () => {
      const section = findCurrentSection('orgel.html');
      expect(section).not.toBeNull();
      expect(section.label).toBe('Erleben');
    });

    it('returns section for a page in Entdecken', () => {
      const section = findCurrentSection('weltkarte.html');
      expect(section.label).toBe('Entdecken');
    });

    it('returns section for a page in Erinnern', () => {
      const section = findCurrentSection('stimmen.html');
      expect(section.label).toBe('Erinnern');
    });

    it('returns null for hub page', () => {
      expect(findCurrentSection('klangkathedrale.html')).toBeNull();
    });

    it('returns null for architektur', () => {
      expect(findCurrentSection('architektur.html')).toBeNull();
    });

    it('returns null for unknown page', () => {
      expect(findCurrentSection('unknown.html')).toBeNull();
    });
  });

  describe('findCurrentPageTitle()', () => {
    it('returns title for section page', () => {
      expect(findCurrentPageTitle('orgel.html')).toBe('Orgel');
    });

    it('returns Architektur for architektur page', () => {
      expect(findCurrentPageTitle('architektur.html')).toBe('Architektur');
    });

    it('returns null for hub page', () => {
      expect(findCurrentPageTitle('klangkathedrale.html')).toBeNull();
    });

    it('returns null for unknown page', () => {
      expect(findCurrentPageTitle('unknown.html')).toBeNull();
    });
  });

  describe('createDropdown()', () => {
    const section = NAV_SECTIONS[0]; // Erleben

    it('returns a span wrapper with correct class', () => {
      const dd = createDropdown(section, 'orgel.html');
      expect(dd.tagName).toBe('SPAN');
      expect(dd.className).toBe('kk-bc-dropdown');
    });

    it('has a trigger button with section label', () => {
      const dd = createDropdown(section, 'orgel.html');
      const trigger = dd.querySelector('.kk-bc-trigger');
      expect(trigger).not.toBeNull();
      expect(trigger.textContent).toContain('Erleben');
      expect(trigger.textContent).toContain('\u25BE');
    });

    it('trigger has aria-expanded=false', () => {
      const dd = createDropdown(section, 'orgel.html');
      const trigger = dd.querySelector('.kk-bc-trigger');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('trigger has aria-haspopup=true', () => {
      const dd = createDropdown(section, 'orgel.html');
      const trigger = dd.querySelector('.kk-bc-trigger');
      expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    });

    it('has a hidden menu with role=menu', () => {
      const dd = createDropdown(section, 'orgel.html');
      const menu = dd.querySelector('.kk-bc-menu');
      expect(menu).not.toBeNull();
      expect(menu.hidden).toBe(true);
      expect(menu.getAttribute('role')).toBe('menu');
    });

    it('menu has correct number of items', () => {
      const dd = createDropdown(section, 'orgel.html');
      const items = dd.querySelectorAll('.kk-bc-menu-item');
      expect(items).toHaveLength(4);
    });

    it('marks current page as active span (not a link)', () => {
      const dd = createDropdown(section, 'orgel.html');
      const active = dd.querySelector('.kk-bc-menu-active');
      expect(active).not.toBeNull();
      expect(active.tagName).toBe('SPAN');
      expect(active.getAttribute('aria-current')).toBe('page');
      expect(active.textContent).toBe('Orgel');
    });

    it('other pages are links', () => {
      const dd = createDropdown(section, 'orgel.html');
      const links = dd.querySelectorAll('a.kk-bc-menu-item');
      expect(links).toHaveLength(3);
    });

    it('menu items have role=menuitem', () => {
      const dd = createDropdown(section, 'orgel.html');
      const items = dd.querySelectorAll('[role="menuitem"]');
      expect(items).toHaveLength(4);
    });
  });

  describe('toggleDropdown()', () => {
    it('opens a closed dropdown', () => {
      const dd = createDropdown(NAV_SECTIONS[0], 'orgel.html');
      toggleDropdown(dd);
      expect(dd.querySelector('.kk-bc-menu').hidden).toBe(false);
      expect(dd.querySelector('.kk-bc-trigger').getAttribute('aria-expanded')).toBe('true');
    });

    it('closes an open dropdown', () => {
      const dd = createDropdown(NAV_SECTIONS[0], 'orgel.html');
      toggleDropdown(dd); // open
      toggleDropdown(dd); // close
      expect(dd.querySelector('.kk-bc-menu').hidden).toBe(true);
      expect(dd.querySelector('.kk-bc-trigger').getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('closeAllDropdowns()', () => {
    it('closes all open dropdowns in a bar', () => {
      const bar = createBreadcrumb('orgel.html');
      const dd = bar.querySelector('.kk-bc-dropdown');
      toggleDropdown(dd); // open
      expect(dd.querySelector('.kk-bc-menu').hidden).toBe(false);

      closeAllDropdowns(bar);
      expect(dd.querySelector('.kk-bc-menu').hidden).toBe(true);
      expect(dd.querySelector('.kk-bc-trigger').getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('createBreadcrumb()', () => {
    describe('hub page (klangkathedrale.html)', () => {
      it('returns a nav element', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        expect(bar.tagName).toBe('NAV');
        expect(bar.className).toBe('kk-bc-bar');
      });

      it('has aria-label Breadcrumb', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        expect(bar.getAttribute('aria-label')).toBe('Breadcrumb');
      });

      it('has one breadcrumb item', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        expect(items).toHaveLength(1);
      });

      it('shows Klangkathedrale as current page (span, not link)', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        const current = bar.querySelector('.kk-bc-current');
        expect(current).not.toBeNull();
        expect(current.tagName).toBe('SPAN');
        expect(current.textContent).toBe('Klangkathedrale');
        expect(current.getAttribute('aria-current')).toBe('page');
      });

      it('has no dropdown', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        expect(bar.querySelector('.kk-bc-dropdown')).toBeNull();
      });

      it('has no home link', () => {
        const bar = createBreadcrumb('klangkathedrale.html');
        expect(bar.querySelector('.kk-bc-link')).toBeNull();
      });
    });

    describe('section subpage (orgel.html)', () => {
      it('has 3 breadcrumb items', () => {
        const bar = createBreadcrumb('orgel.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        expect(items).toHaveLength(3);
      });

      it('first item is a link to klangkathedrale', () => {
        const bar = createBreadcrumb('orgel.html');
        const link = bar.querySelector('.kk-bc-link');
        expect(link).not.toBeNull();
        expect(link.href).toContain('klangkathedrale.html');
        expect(link.textContent).toBe('Klangkathedrale');
      });

      it('second item has section dropdown', () => {
        const bar = createBreadcrumb('orgel.html');
        const dd = bar.querySelector('.kk-bc-dropdown');
        expect(dd).not.toBeNull();
        expect(dd.querySelector('.kk-bc-trigger').textContent).toContain('Erleben');
      });

      it('third item shows current page name', () => {
        const bar = createBreadcrumb('orgel.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        const current = items[2].querySelector('.kk-bc-current');
        expect(current.textContent).toBe('Orgel');
        expect(current.getAttribute('aria-current')).toBe('page');
      });

      it('dropdown contains sibling pages', () => {
        const bar = createBreadcrumb('orgel.html');
        const menuItems = bar.querySelectorAll('.kk-bc-menu-item');
        expect(menuItems).toHaveLength(4);
      });
    });

    describe('Entdecken subpage (weltkarte.html)', () => {
      it('shows Entdecken section in dropdown', () => {
        const bar = createBreadcrumb('weltkarte.html');
        const trigger = bar.querySelector('.kk-bc-trigger');
        expect(trigger.textContent).toContain('Entdecken');
      });

      it('shows Weltkarte as current page', () => {
        const bar = createBreadcrumb('weltkarte.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        const current = items[2].querySelector('.kk-bc-current');
        expect(current.textContent).toBe('Weltkarte');
      });
    });

    describe('architektur page', () => {
      it('has 2 breadcrumb items', () => {
        const bar = createBreadcrumb('architektur.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        expect(items).toHaveLength(2);
      });

      it('first item links home', () => {
        const bar = createBreadcrumb('architektur.html');
        const link = bar.querySelector('.kk-bc-link');
        expect(link.href).toContain('klangkathedrale.html');
      });

      it('second item shows Architektur as current', () => {
        const bar = createBreadcrumb('architektur.html');
        const items = bar.querySelectorAll('.kk-bc-item');
        const current = items[1].querySelector('.kk-bc-current');
        expect(current.textContent).toBe('Architektur');
        expect(current.getAttribute('aria-current')).toBe('page');
      });

      it('has no dropdown', () => {
        const bar = createBreadcrumb('architektur.html');
        expect(bar.querySelector('.kk-bc-dropdown')).toBeNull();
      });
    });

    describe('interaction: dropdown toggle via click', () => {
      it('opens dropdown when trigger is clicked', () => {
        const bar = createBreadcrumb('orgel.html');
        document.body.appendChild(bar);
        const trigger = bar.querySelector('.kk-bc-trigger');
        trigger.click();
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(false);
        bar.remove();
      });

      it('closes dropdown when trigger is clicked again', () => {
        const bar = createBreadcrumb('orgel.html');
        document.body.appendChild(bar);
        const trigger = bar.querySelector('.kk-bc-trigger');
        trigger.click();
        trigger.click();
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(true);
        bar.remove();
      });

      it('closes dropdown when clicking elsewhere in the bar', () => {
        const bar = createBreadcrumb('orgel.html');
        document.body.appendChild(bar);
        const trigger = bar.querySelector('.kk-bc-trigger');
        trigger.click();
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(false);
        // Click the bar itself (not the trigger)
        bar.querySelector('.kk-bc-link').click();
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(true);
        bar.remove();
      });
    });

    describe('interaction: Escape closes dropdown', () => {
      it('closes dropdown on Escape keydown', () => {
        const bar = createBreadcrumb('orgel.html');
        document.body.appendChild(bar);
        const trigger = bar.querySelector('.kk-bc-trigger');
        trigger.click();
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(false);

        bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(bar.querySelector('.kk-bc-menu').hidden).toBe(true);
        expect(bar.querySelector('.kk-bc-trigger').getAttribute('aria-expanded')).toBe('false');
        bar.remove();
      });

      it('does not error on Escape when no dropdown is open', () => {
        const bar = createBreadcrumb('orgel.html');
        document.body.appendChild(bar);
        expect(() => {
          bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        }).not.toThrow();
        bar.remove();
      });
    });
  });

  describe('injectStyles()', () => {
    it('creates style element with correct id', () => {
      injectStyles();
      const style = document.getElementById('kk-nav-styles');
      expect(style).not.toBeNull();
      expect(style.tagName).toBe('STYLE');
    });

    it('is idempotent', () => {
      injectStyles();
      injectStyles();
      const styles = document.querySelectorAll('#kk-nav-styles');
      expect(styles).toHaveLength(1);
    });

    it('contains breadcrumb selectors', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('.kk-bc-bar');
      expect(css).toContain('.kk-bc-link');
      expect(css).toContain('.kk-bc-trigger');
      expect(css).toContain('.kk-bc-menu');
    });

    it('contains reduced-motion media query', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('prefers-reduced-motion: reduce');
    });

    it('sets z-index 10000 for bar', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('z-index: 10000');
    });

    it('uses fixed positioning', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('position: fixed');
    });

    it('sets 44px height', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('height: 44px');
    });

    it('includes gold border-bottom', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('border-bottom: 1px solid rgba(201,168,76');
    });
  });
});
