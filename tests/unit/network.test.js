import { describe, it, expect, vi } from 'vitest';
import { linkColor, linkWidth, isNodeVisible, isLinkVisible, debounce } from '../../src/lib/network.js';

describe('linkColor', () => {
  it('returns correct color for founded type', () => {
    expect(linkColor({ type: 'founded' })).toBe('rgba(201,168,76,0.4)');
  });
  it('returns correct color for teacher type', () => {
    expect(linkColor({ type: 'teacher' })).toBe('rgba(212,114,92,0.35)');
  });
  it('returns correct color for influence type', () => {
    expect(linkColor({ type: 'influence' })).toBe('rgba(139,126,200,0.25)');
  });
  it('returns correct color for member type', () => {
    expect(linkColor({ type: 'member' })).toBe('rgba(107,144,128,0.3)');
  });
  it('returns fallback for unknown type', () => {
    expect(linkColor({ type: 'unknown' })).toBe('rgba(245,240,232,0.1)');
  });
  it('returns fallback for undefined type', () => {
    expect(linkColor({})).toBe('rgba(245,240,232,0.1)');
  });
  it('returns correct color for all known types', () => {
    const types = ['founded', 'led', 'taught', 'teacher', 'influence', 'colleague', 'successor', 'studied', 'member'];
    types.forEach(type => {
      expect(linkColor({ type })).not.toBe('rgba(245,240,232,0.1)');
    });
  });
});

describe('linkWidth', () => {
  it('returns weight * 0.8 for large weights', () => {
    expect(linkWidth({ weight: 5 })).toBe(4);
  });
  it('returns minimum of 1', () => {
    expect(linkWidth({ weight: 0 })).toBe(1);
    expect(linkWidth({ weight: 0.5 })).toBe(1);
  });
  it('returns 1 for weight close to 1.25', () => {
    expect(linkWidth({ weight: 1.25 })).toBe(1);
  });
  it('returns > 1 for weight > 1.25', () => {
    expect(linkWidth({ weight: 2 })).toBe(1.6);
  });
});

describe('isNodeVisible', () => {
  it('returns true when filter is all', () => {
    expect(isNodeVisible({ id: 'foo' }, 'all')).toBe(true);
  });
  it('returns true for rilling regardless of filter', () => {
    expect(isNodeVisible({ id: 'rilling' }, 'bachakademie')).toBe(true);
  });
  it('returns true when node has the institution', () => {
    expect(isNodeVisible({ id: 'foo', institutions: ['bachakademie', 'oregon'] }, 'bachakademie')).toBe(true);
  });
  it('returns false when node does not have the institution', () => {
    expect(isNodeVisible({ id: 'foo', institutions: ['oregon'] }, 'bachakademie')).toBe(false);
  });
  it('returns false when node has no institutions', () => {
    expect(isNodeVisible({ id: 'foo' }, 'bachakademie')).toBe(false);
  });
});

describe('isLinkVisible', () => {
  const nodes = [
    { id: 'rilling' },
    { id: 'a', institutions: ['bach'] },
    { id: 'b', institutions: ['oregon'] },
    { id: 'c' }
  ];

  it('returns true when both nodes visible (filter=all)', () => {
    expect(isLinkVisible({ source: 'a', target: 'b' }, nodes, 'all')).toBe(true);
  });
  it('returns true when link involves rilling and visible target', () => {
    expect(isLinkVisible({ source: 'rilling', target: 'a' }, nodes, 'bach')).toBe(true);
  });
  it('returns false when link involves rilling but invisible target', () => {
    expect(isLinkVisible({ source: 'rilling', target: 'c' }, nodes, 'bach')).toBe(false);
  });
  it('returns false when one node is not visible', () => {
    expect(isLinkVisible({ source: 'a', target: 'b' }, nodes, 'bach')).toBe(false);
  });
  it('handles object source/target (d3 simulation)', () => {
    expect(isLinkVisible(
      { source: { id: 'a' }, target: { id: 'b' } },
      nodes, 'bach'
    )).toBe(false);
  });
  it('handles mixed object/string source/target', () => {
    expect(isLinkVisible(
      { source: { id: 'rilling' }, target: 'a' },
      nodes, 'bach'
    )).toBe(true);
  });
});

describe('debounce', () => {
  it('delays function execution', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    await new Promise(r => setTimeout(r, 60));
    expect(fn).toHaveBeenCalledOnce();
  });
  it('only calls once after rapid calls', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced(1);
    debounced(2);
    debounced(3);
    await new Promise(r => setTimeout(r, 60));
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith(3);
  });
  it('preserves this context', async () => {
    const obj = {
      value: 42,
      method: debounce(function() { return this.value; }, 10)
    };
    obj.method();
    await new Promise(r => setTimeout(r, 20));
  });
  it('passes arguments correctly', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 10);
    debounced('a', 'b', 'c');
    await new Promise(r => setTimeout(r, 20));
    expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
  });
});
