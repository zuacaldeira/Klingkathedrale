import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  NAV_SECTIONS,
  getCurrentPage,
  createNavButton,
  createNavOverlay,
  injectStyles,
  openNav,
  closeNav,
  trapFocus
} from '../../src/lib/nav.js';

describe('nav', () => {
  beforeEach(() => {
    // Clean up any injected elements
    document.getElementById('kk-nav-overlay')?.remove();
    document.querySelector('.kk-nav-btn')?.remove();
    document.getElementById('kk-nav-styles')?.remove();
    document.body.style.overflow = '';
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

  describe('createNavButton()', () => {
    it('returns a button element', () => {
      const btn = createNavButton();
      expect(btn.tagName).toBe('BUTTON');
    });

    it('has correct class', () => {
      const btn = createNavButton();
      expect(btn.className).toBe('kk-nav-btn');
    });

    it('has aria-label', () => {
      const btn = createNavButton();
      expect(btn.getAttribute('aria-label')).toBe('Navigation öffnen');
    });

    it('has aria-expanded=false', () => {
      const btn = createNavButton();
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });

    it('has aria-controls pointing to overlay', () => {
      const btn = createNavButton();
      expect(btn.getAttribute('aria-controls')).toBe('kk-nav-overlay');
    });

    it('contains SVG hamburger icon', () => {
      const btn = createNavButton();
      expect(btn.querySelector('svg')).not.toBeNull();
      expect(btn.querySelectorAll('line')).toHaveLength(3);
    });
  });

  describe('createNavOverlay()', () => {
    it('returns a div with correct id', () => {
      const overlay = createNavOverlay('orgel.html');
      expect(overlay.id).toBe('kk-nav-overlay');
    });

    it('has role=dialog', () => {
      const overlay = createNavOverlay('orgel.html');
      expect(overlay.getAttribute('role')).toBe('dialog');
    });

    it('has aria-modal=true', () => {
      const overlay = createNavOverlay('orgel.html');
      expect(overlay.getAttribute('aria-modal')).toBe('true');
    });

    it('is hidden by default', () => {
      const overlay = createNavOverlay('orgel.html');
      expect(overlay.hidden).toBe(true);
    });

    it('contains a close button', () => {
      const overlay = createNavOverlay('orgel.html');
      const closeBtn = overlay.querySelector('.kk-nav-close');
      expect(closeBtn).not.toBeNull();
      expect(closeBtn.getAttribute('aria-label')).toBe('Navigation schließen');
    });

    it('contains hub link to klangkathedrale', () => {
      const overlay = createNavOverlay('orgel.html');
      const hubLink = overlay.querySelector('.kk-nav-hub');
      expect(hubLink).not.toBeNull();
      expect(hubLink.href).toContain('klangkathedrale.html');
    });

    it('marks hub link as current when on klangkathedrale', () => {
      const overlay = createNavOverlay('klangkathedrale.html');
      const hubLink = overlay.querySelector('.kk-nav-hub');
      expect(hubLink.getAttribute('aria-current')).toBe('page');
    });

    it('has 3 section headings', () => {
      const overlay = createNavOverlay('orgel.html');
      const headings = overlay.querySelectorAll('.kk-nav-heading');
      expect(headings).toHaveLength(3);
    });

    it('has 11 page links', () => {
      const overlay = createNavOverlay('orgel.html');
      const links = overlay.querySelectorAll('.kk-nav-link');
      expect(links).toHaveLength(11);
    });

    it('marks active page with aria-current', () => {
      const overlay = createNavOverlay('orgel.html');
      const activeLink = overlay.querySelector('[aria-current="page"].kk-nav-link');
      expect(activeLink).not.toBeNull();
      expect(activeLink.href).toContain('orgel.html');
    });

    it('does not mark other pages as current', () => {
      const overlay = createNavOverlay('orgel.html');
      const currentLinks = overlay.querySelectorAll('.kk-nav-link[aria-current="page"]');
      expect(currentLinks).toHaveLength(1);
    });

    it('contains architektur footer link', () => {
      const overlay = createNavOverlay('orgel.html');
      const footerLink = overlay.querySelector('.kk-nav-footer-link');
      expect(footerLink).not.toBeNull();
      expect(footerLink.href).toContain('architektur.html');
    });

    it('marks architektur as current when active', () => {
      const overlay = createNavOverlay('architektur.html');
      const footerLink = overlay.querySelector('.kk-nav-footer-link');
      expect(footerLink.getAttribute('aria-current')).toBe('page');
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

    it('contains key selectors', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('.kk-nav-btn');
      expect(css).toContain('.kk-nav-overlay');
      expect(css).toContain('.kk-nav-close');
      expect(css).toContain('.kk-nav-link');
    });

    it('contains reduced-motion media query', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('prefers-reduced-motion: reduce');
    });

    it('sets z-index 9999 for button', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('z-index: 9999');
    });

    it('sets z-index 10000 for overlay', () => {
      injectStyles();
      const css = document.getElementById('kk-nav-styles').textContent;
      expect(css).toContain('z-index: 10000');
    });
  });

  describe('openNav()', () => {
    it('shows the overlay', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      expect(overlay.hidden).toBe(false);
    });

    it('sets aria-expanded to true', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });

    it('locks body scroll', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('focuses close button', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      expect(document.activeElement).toBe(overlay.querySelector('.kk-nav-close'));
    });
  });

  describe('closeNav()', () => {
    it('hides the overlay', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      closeNav(btn, overlay);
      expect(overlay.hidden).toBe(true);
    });

    it('sets aria-expanded to false', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      closeNav(btn, overlay);
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });

    it('restores body scroll', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      closeNav(btn, overlay);
      expect(document.body.style.overflow).toBe('');
    });

    it('returns focus to nav button', () => {
      const btn = createNavButton();
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(btn);
      document.body.appendChild(overlay);
      openNav(btn, overlay);
      closeNav(btn, overlay);
      expect(document.activeElement).toBe(btn);
    });
  });

  describe('trapFocus()', () => {
    it('wraps focus from last to first on Tab', () => {
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(overlay);
      overlay.hidden = false;
      trapFocus(overlay);

      const focusable = overlay.querySelectorAll('button, a[href]');
      const last = focusable[focusable.length - 1];
      const first = focusable[0];
      last.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      overlay.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
      expect(document.activeElement).toBe(first);
    });

    it('wraps focus from first to last on Shift+Tab', () => {
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(overlay);
      overlay.hidden = false;
      trapFocus(overlay);

      const focusable = overlay.querySelectorAll('button, a[href]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      first.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      overlay.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
      expect(document.activeElement).toBe(last);
    });

    it('does not interfere with non-Tab keys', () => {
      const overlay = createNavOverlay('orgel.html');
      document.body.appendChild(overlay);
      overlay.hidden = false;
      trapFocus(overlay);

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const spy = vi.spyOn(event, 'preventDefault');
      overlay.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
