import { describe, it, expect, beforeEach } from 'vitest';
import { formatDate } from '../../src/lib/date.js';

describe('Stimmen localStorage integration', () => {
  const STORAGE_KEY = 'klangkathedrale_stimmen';

  beforeEach(() => {
    localStorage.clear();
  });

  it('saves entries to localStorage', () => {
    const entries = [
      { name: 'Test User', text: 'A message', date: '2024-01-15T12:00:00Z' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('Test User');
  });

  it('loads entries from localStorage', () => {
    const entries = [
      { name: 'User A', text: 'Message A', date: '2024-01-15' },
      { name: 'User B', text: 'Message B', date: '2024-02-20' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(loaded).toHaveLength(2);
  });

  it('handles missing localStorage key', () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeNull();
  });

  it('handles corrupt JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json{{{');
    let entries;
    try {
      entries = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      entries = []; // fallback
    }
    expect(entries).toEqual([]);
  });

  it('formats saved dates with formatDate', () => {
    const entries = [
      { name: 'Test', text: 'Text', date: '2024-06-15T10:00:00Z' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const formatted = formatDate(loaded[0].date);
    expect(formatted).toContain('Juni');
    expect(formatted).toContain('2024');
  });

  it('can add new entries and save', () => {
    const entries = [];
    entries.push({ name: 'New User', text: 'New message', date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(loaded).toHaveLength(1);
  });

  it('persists across read/write cycles', () => {
    const initial = [{ name: 'A', text: 'msg', date: '2024-01-01' }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    loaded.push({ name: 'B', text: 'msg2', date: '2024-02-01' });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));

    const final = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(final).toHaveLength(2);
  });

  it('handles empty array in storage', () => {
    localStorage.setItem(STORAGE_KEY, '[]');
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(loaded).toEqual([]);
  });
});
